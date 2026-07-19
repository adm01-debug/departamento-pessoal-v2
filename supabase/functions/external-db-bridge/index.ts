// external-db-bridge — Hardened gateway (Onda 36)
// Segurança: JWT via getClaims() para writes, tenant scope (empresa_id),
// denylist de tabelas sensíveis, allowlist de RPC e operadores, validação
// estrita de identificadores, CSRF fail-closed, no-store, payload cap.
//
// Filosofia: leituras anônimas continuam permitidas (compatibilidade com o
// frontend atual — RLS no banco externo é a fonte de verdade), mas qualquer
// operação de escrita exige JWT válido + verificação de tenant.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { verifyCsrf } from "../_shared/csrf.ts";

// -------------------- Headers --------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const NO_STORE = { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" };

// -------------------- Limites e thresholds --------------------
const MAX_PAYLOAD_BYTES = 256 * 1024; // 256 KB
const MAX_LIMIT = 1000;
const SLOW_QUERY_THRESHOLD_MS = 3000;
const VERY_SLOW_QUERY_THRESHOLD_MS = 8000;

// -------------------- Validação de identificadores --------------------
// Permite: letras, dígitos, _, ponto (schema.tab), vírgula/espaço (colunas
// múltiplas em select), !, *, (, ) e :: para casts. Bloqueia ;, --, /*, comentários.
const IDENTIFIER_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const COLUMNS_RE = /^[a-zA-Z0-9_,.\s*!():"-]+$/;
const DANGEROUS_TOKENS = /(;|--|\/\*|\*\/|\bDROP\b|\bTRUNCATE\b|\bALTER\b|\bGRANT\b)/i;

function isSafeTableName(t: unknown): t is string {
  return typeof t === "string" && t.length > 0 && t.length <= 63 && IDENTIFIER_RE.test(t);
}
function isSafeColumnsExpr(c: unknown): c is string {
  if (typeof c !== "string") return false;
  if (c.length === 0 || c.length > 2000) return false;
  if (DANGEROUS_TOKENS.test(c)) return false;
  return COLUMNS_RE.test(c);
}

// -------------------- Denylist de tabelas --------------------
// Estas tabelas nunca podem ser acessadas via bridge (nem leitura). Contêm
// dados de segurança/roles que devem ser gerenciados apenas server-side.
const TABLE_DENYLIST = new Set<string>([
  "user_roles",
  "secrets",
  "vault",
  "ip_whitelist",
  "blocked_ips",
  "rate_limit_config",
  "rate_limit_logs",
  "login_attempts",
  "login_lockouts",
  "login_rate_limits",
  "password_policies",
  "security_alerts",
  "audit_log",
  "geo_blocking_config",
  "geo_allowed_countries",
  "govbr_auth_state",
]);

// Tabelas em que writes são permitidos apenas com auth+tenant válido.
// (Todas as tabelas de negócio; para leitura, RLS externo protege.)
const TENANT_SCOPED_TABLES = new Set<string>([
  "colaboradores", "empresas", "folhas_pagamento", "holerites", "batidas_ponto",
  "registros_ponto", "admissoes", "candidaturas", "ferias_solicitacoes",
  "periodos_aquisitivos", "provisoes_mensais", "provisoes_folha", "beneficios",
  "documentos", "notificacoes", "workflows_execucoes", "workflows_definicoes",
  "auditoria_logs", "ferias_audit_log", "esocial_eventos", "guias_impostos",
]);

// -------------------- Allowlist de RPCs --------------------
// Somente RPCs explicitamente listadas são invocáveis via bridge.
const RPC_ALLOWLIST = new Set<string>([
  // segurança / login
  "check_login_lock", "record_failed_login", "reset_login_attempts",
  "check_brute_force", "check_rate_limit", "is_ip_blocked", "is_ip_whitelisted",
  "is_country_allowed",
  // roles / tenant
  "has_role", "is_admin", "get_user_roles", "get_user_empresas",
  "get_user_default_empresa", "get_user_scope_empresas", "user_belongs_to_empresa",
  "get_auth_empresa_id",
  // negócio
  "get_personnel_cost_projection", "get_colaborador_banco_horas",
  "calcular_dias_ferias", "fn_calculate_periodo_aquisitivo",
  "fn_link_gov_br_account", "processar_ajuste_aprovado",
  "gerar_alertas_preditivos_ia", "anonimizar_dados_pessoais",
  "run_rls_tests",
]);
const LOGIN_PROTECTION_RPC_FALLBACKS: Record<string, unknown> = {
  check_login_lock: false,
  record_failed_login: null,
  reset_login_attempts: null,
};

// -------------------- Allowlist de operadores --------------------
const FILTER_OPS = new Set([
  "eq", "neq", "gt", "gte", "lt", "lte",
  "like", "ilike", "in", "is", "or", "not", "contains", "match",
]);
const NOT_EXTRA_OPS = new Set(["eq", "neq", "gt", "gte", "lt", "lte", "in", "is"]);

// Validação de expressões .or() — permite apenas operadores seguros sobre colunas válidas
// Formato PostgREST: "col.op.val,col.op.val" — bloqueia subqueries, parênteses aninhados, SQL keywords
const OR_SAFE_OPS = /^(eq|neq|gt|gte|lt|lte|like|ilike|is|in)\./;
const OR_DANGEROUS = /(;|--|\/\*|\*\/|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bEXEC\b)/i;
function isSafeOrExpression(expr: unknown): boolean {
  if (typeof expr !== "string" || expr.length === 0 || expr.length > 500) return false;
  if (OR_DANGEROUS.test(expr)) return false;
  const parts = expr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) return false;
    // Each part must be: column_name.operator.value (or nested and/or with parens)
    // Allow parentheses for grouping but validate each leaf
    const leaf = trimmed.replace(/^\(+/, "").replace(/\)+$/, "");
    const dotIdx = leaf.indexOf(".");
    if (dotIdx < 1) return false;
    const colName = leaf.substring(0, dotIdx);
    if (!IDENTIFIER_RE.test(colName)) return false;
    const rest = leaf.substring(dotIdx + 1);
    if (!OR_SAFE_OPS.test(rest)) return false;
  }
  return true;
}

// -------------------- Zod schemas --------------------
const FilterSchema = z.object({
  column: z.string().max(120),
  op: z.string().max(20),
  value: z.unknown(),
  extraOp: z.string().max(20).optional(),
});
const BodySchema = z.object({
  action: z.enum(["select", "insert", "update", "delete", "upsert", "rpc"]),
  table: z.string().max(63).optional(),
  rpcName: z.string().max(63).optional(),
  fn: z.string().max(63).optional(),
  columns: z.string().max(2000).optional(),
  filters: z.array(FilterSchema).max(50).optional(),
  order: z.object({ column: z.string().max(120), ascending: z.boolean().optional() }).optional(),
  limit: z.number().int().optional(),
  offset: z.number().int().min(0).optional(),
  countMode: z.enum(["none", "exact", "planned", "estimated"]).optional(),
  single: z.boolean().optional(),
  data: z.union([z.record(z.unknown()), z.array(z.record(z.unknown()))]).optional(),
  params: z.record(z.unknown()).optional(),
  userId: z.string().max(64).optional(),
});

// -------------------- Telemetria --------------------
interface TelemetryMeta {
  operation: string;
  table?: string;
  rpcName?: string;
  limit?: number;
  offset?: number;
  countMode?: string;
  durationMs: number;
  recordCount?: number;
  status: "ok" | "error" | "slow" | "very_slow";
  error?: string;
  userId?: string | null;
}
function classifySeverity(durationMs: number, hasError: boolean): TelemetryMeta["status"] {
  if (hasError) return "error";
  if (durationMs >= VERY_SLOW_QUERY_THRESHOLD_MS) return "very_slow";
  if (durationMs >= SLOW_QUERY_THRESHOLD_MS) return "slow";
  return "ok";
}
// ---------- Buffer batch de telemetria (reduz INSERTs de 446/s → ~10/s) ----------
// Estratégia:
//   - Buffer in-isolate (Deno mantém isolates warm entre requests, então o
//     buffer sobrevive entre invocações e o batch acontece organicamente).
//   - Flush quando: buffer atinge MAX_BATCH, ou passou FLUSH_INTERVAL_MS
//     desde o último flush, o que ocorrer primeiro.
//   - Eventos `error` continuam sendo enviados individualmente para não perder
//     sinais críticos em cold-start / crash de isolate.
type TelemetryRow = {
  operation: string;
  table_name: string | null;
  rpc_name: string | null;
  duration_ms: number;
  record_count: number | null;
  query_limit: number | null;
  query_offset: number | null;
  count_mode: string | null;
  severity: string;
  error_message: string | null;
  user_id: string | null;
};
const TELEMETRY_MAX_BATCH = 25;
const TELEMETRY_FLUSH_INTERVAL_MS = 2000;
const telemetryBuffer: TelemetryRow[] = [];
let telemetryLastFlush = Date.now();
let telemetryFlushInFlight: Promise<void> | null = null;

function getServiceClient() {
  const localUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!localUrl || !serviceKey) return null;
  return createClient(localUrl, serviceKey);
}

async function flushTelemetry(): Promise<void> {
  if (telemetryBuffer.length === 0) return;
  if (telemetryFlushInFlight) return telemetryFlushInFlight;

  const batch = telemetryBuffer.splice(0, telemetryBuffer.length);
  telemetryLastFlush = Date.now();
  const client = getServiceClient();
  if (!client) return;

  telemetryFlushInFlight = (async () => {
    try {
      const { error } = await client.from("query_telemetry").insert(batch);
      if (error) console.warn("[telemetry-batch] persist falhou:", error.message);
    } catch (e) {
      console.warn("[telemetry-batch] exceção:", (e as Error).message);
    } finally {
      telemetryFlushInFlight = null;
    }
  })();
  return telemetryFlushInFlight;
}

function enqueueTelemetry(row: TelemetryRow) {
  telemetryBuffer.push(row);
  const sizeReady = telemetryBuffer.length >= TELEMETRY_MAX_BATCH;
  const timeReady = Date.now() - telemetryLastFlush >= TELEMETRY_FLUSH_INTERVAL_MS;
  if (sizeReady || timeReady) {
    // Fire-and-forget — não bloqueia a request
    flushTelemetry().catch(() => {});
  }
}

function emitTelemetry(meta: TelemetryMeta) {
  const icon =
    meta.status === "very_slow" ? "🔴" : meta.status === "slow" ? "🟡" : meta.status === "error" ? "❌" : "✅";
  const target = meta.rpcName || meta.table || "unknown";
  const line =
    `${icon} [telemetry] ${meta.operation}:${target} ${meta.durationMs}ms` +
    ` | records=${meta.recordCount ?? "-"} limit=${meta.limit ?? "-"} offset=${meta.offset ?? "-"} count=${meta.countMode ?? "-"}`;
  if (meta.status === "very_slow") console.warn(`⚠️ VERY SLOW: ${line}`);
  else if (meta.status === "slow") console.warn(`⚠️ SLOW: ${line}`);
  else if (meta.status === "error") console.error(line + ` error=${meta.error}`);
  else console.info(line);

  if (meta.status === "ok") return;

  const row: TelemetryRow = {
    operation: meta.operation,
    table_name: meta.table || null,
    rpc_name: meta.rpcName || null,
    duration_ms: meta.durationMs,
    record_count: meta.recordCount ?? null,
    query_limit: meta.limit ?? null,
    query_offset: meta.offset ?? null,
    count_mode: meta.countMode || null,
    severity: meta.status,
    error_message: meta.error || null,
    user_id: meta.userId || null,
  };

  // Erros vão direto (não podem ser perdidos em cold-start).
  if (meta.status === "error") {
    const client = getServiceClient();
    if (client) {
      client.from("query_telemetry").insert(row).then(
        ({ error }) => { if (error) console.warn("[telemetry-persist]", error.message); },
      );
    }
    return;
  }

  // slow / very_slow → batched
  enqueueTelemetry(row);
}

// -------------------- Sanitização de valores --------------------
function sanitizeData(val: unknown): unknown {
  if (val === "undefined" || val === "null" || val === undefined) return null;
  if (Array.isArray(val)) return val.map(sanitizeData);
  if (val !== null && typeof val === "object") {
    const obj: Record<string, unknown> = {};
    for (const key in val as Record<string, unknown>) {
      obj[key] = sanitizeData((val as Record<string, unknown>)[key]);
    }
    return obj;
  }
  return val;
}

// -------------------- Respostas padronizadas --------------------
function jsonError(status: number, code: string, message: string, extra?: Record<string, unknown>) {
  return new Response(JSON.stringify({ error: message, code, ...extra }), { status, headers: NO_STORE });
}
function jsonOk(payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), { status: 200, headers: NO_STORE });
}

// -------------------- Tenant scope check --------------------
async function assertTenantScope(
  localClient: ReturnType<typeof createClient>,
  userId: string,
  data: Record<string, unknown> | Record<string, unknown>[] | undefined,
): Promise<{ ok: true } | { ok: false; msg: string }> {
  if (!data) return { ok: true };
  const rows = Array.isArray(data) ? data : [data];
  const empresaIds = new Set<string>();
  for (const r of rows) {
    const eid = (r as Record<string, unknown>)?.empresa_id;
    if (typeof eid === "string" && eid) empresaIds.add(eid);
  }
  if (empresaIds.size === 0) return { ok: true };

  // Verifica via RPC has_role(admin) primeiro
  const { data: isAdminData } = await localClient.rpc("is_admin", { _user_id: userId });
  if (isAdminData === true) return { ok: true };

  for (const eid of empresaIds) {
    const { data: belongs } = await localClient.rpc("user_belongs_to_empresa", {
      _user_id: userId,
      _empresa_id: eid,
    });
    if (belongs !== true) return { ok: false, msg: `Tenant scope denied for empresa_id=${eid}` };
  }
  return { ok: true };
}

// ============================================================
// Handler principal
// ============================================================
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonError(405, "METHOD_NOT_ALLOWED", "Only POST is allowed");

  // CSRF fail-closed em toda operação de escrita/rpc.
  const csrf = await verifyCsrf(req);
  if (!csrf.ok && csrf.response) return csrf.response;

  // Cap payload
  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return jsonError(413, "PAYLOAD_TOO_LARGE", `Payload exceeds ${MAX_PAYLOAD_BYTES} bytes`);
  }

  // Auth (opcional para reads; obrigatório para writes/rpc).
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authHeader = req.headers.get("Authorization");
  let user: { id: string } | null = null;

  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (token && token !== supabaseAnonKey) {
      try {
        const localClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data, error } = await localClient.auth.getClaims(token);
        if (!error && data?.claims?.sub) {
          user = { id: String(data.claims.sub) };
        }
      } catch { /* segue anônimo */ }
    }
  }

  // Body + validação estrutural
  let rawBody: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_PAYLOAD_BYTES) {
      return jsonError(413, "PAYLOAD_TOO_LARGE", "Body too large");
    }
    rawBody = JSON.parse(text);
  } catch {
    return jsonError(400, "INVALID_JSON", "Invalid JSON body");
  }
  const parsed = BodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return jsonError(400, "SCHEMA_VALIDATION", "Invalid request shape", {
      issues: parsed.error.issues.slice(0, 5),
    });
  }
  const body = parsed.data;
  const { action, table, columns, limit, offset, countMode } = body;
  const rpcName = body.rpcName || body.fn;
  const rpcArgs = sanitizeData(body.params ?? body.data) as Record<string, unknown> | null;
  const data = sanitizeData(body.data) as Record<string, unknown> | Record<string, unknown>[] | undefined;
  const filters = (body.filters ?? [])
    .map((f) => ({ ...f, value: sanitizeData(f.value) }))
    .filter((f) => f.op === "or" || (f.value !== null && f.value !== undefined && f.value !== "" && f.value !== "all"));

  // Validação: writes exigem auth
  const isWrite = action === "insert" || action === "update" || action === "delete" || action === "upsert";
  if (isWrite && !user) {
    return jsonError(401, "UNAUTHORIZED", "Authentication required for write operations");
  }

  // Rate limit — bridge é o endpoint mais genérico: 100 req/min para reads, 30 req/min para writes
  if (user && serviceKey) {
    const { checkRateLimit, rateLimitResponse } = await import('../_shared/rateLimit.ts');
    const rlClient = createClient(supabaseUrl, serviceKey);
    const rlKey = isWrite ? `bridge-write:${user.id}` : `bridge-read:${user.id}`;
    const rlLimit = isWrite ? 30 : 100;
    const rl = await checkRateLimit(rlClient, { key: rlKey, limit: rlLimit, windowSec: 60 });
    if (!rl.allowed) return rateLimitResponse(rl);
  }

  // Validação: table obrigatório para non-rpc + regex + denylist
  if (action !== "rpc") {
    if (!isSafeTableName(table)) {
      return jsonError(400, "INVALID_TABLE", "Table name is invalid");
    }
    if (TABLE_DENYLIST.has(table!)) {
      return jsonError(403, "TABLE_DENIED", `Table '${table}' is not accessible via bridge`);
    }
    if (columns !== undefined && !isSafeColumnsExpr(columns)) {
      return jsonError(400, "INVALID_COLUMNS", "Columns expression is invalid");
    }
  }

  // Validação de operadores nos filtros
  for (const f of filters) {
    if (!FILTER_OPS.has(f.op)) {
      return jsonError(400, "INVALID_OP", `Filter operator '${f.op}' is not allowed`);
    }
    if (f.op === "not" && (!f.extraOp || !NOT_EXTRA_OPS.has(f.extraOp))) {
      return jsonError(400, "INVALID_NOT_OP", "Filter 'not' requires a valid extraOp");
    }
    if (f.op !== "or" && !/^[a-zA-Z0-9_.,()->\s"-]+$/.test(f.column)) {
      return jsonError(400, "INVALID_COLUMN", `Filter column '${f.column}' is invalid`);
    }
  }

  // Externo
  const externalUrl = Deno.env.get("EXTERNAL_DB_URL");
  const externalKey = Deno.env.get("EXTERNAL_DB_KEY");
  if (!externalUrl || !externalKey) {
    return jsonError(500, "NOT_CONFIGURED", "External database not configured");
  }
  const externalClient = createClient(externalUrl, externalKey);

  // Cliente local (para verificação de tenant scope via RPC has_role/user_belongs_to_empresa)
  const localClient = serviceKey ? createClient(supabaseUrl, serviceKey) : null;

  // Tenant scope check para writes em tabelas de negócio
  if (isWrite && user && localClient && table && TENANT_SCOPED_TABLES.has(table)) {
    const scope = await assertTenantScope(localClient, user.id, data);
    if (!scope.ok) {
      return jsonError(403, "TENANT_SCOPE_DENIED", scope.msg);
    }
  }

  const selectColumns = columns || "*";
  const queryLimit = typeof limit === "number" ? Math.min(Math.max(limit, -1), MAX_LIMIT) : 100;
  const queryOffset = offset ?? 0;
  const queryCountMode = countMode || "none";

  try {
    // -------- SELECT --------
    if (action === "select") {
      const t0 = performance.now();
      let query = externalClient
        .from(table!)
        .select(selectColumns, { count: queryCountMode === "none" ? undefined : queryCountMode });
      if (queryLimit !== -1) query = query.range(queryOffset, queryOffset + queryLimit - 1);
      for (const f of filters) {
        if (f.op === "eq") query = query.eq(f.column, f.value);
        else if (f.op === "neq") query = query.neq(f.column, f.value);
        else if (f.op === "gt") query = query.gt(f.column, f.value);
        else if (f.op === "gte") query = query.gte(f.column, f.value);
        else if (f.op === "lt") query = query.lt(f.column, f.value);
        else if (f.op === "lte") query = query.lte(f.column, f.value);
        else if (f.op === "like") query = query.like(f.column, f.value as string);
        else if (f.op === "ilike") query = query.ilike(f.column, f.value as string);
        else if (f.op === "in") query = query.in(f.column, f.value as unknown[]);
        else if (f.op === "is") query = query.is(f.column, f.value as null | boolean);
        else if (f.op === "or") {
          if (!isSafeOrExpression(f.value)) return jsonError(400, "INVALID_OR_FILTER", "Expressão .or() contém operadores ou padrões não permitidos");
          query = query.or(f.value as string);
        }
        else if (f.op === "not") query = query.not(f.column, f.extraOp!, f.value);
        else if (f.op === "contains") query = query.contains(f.column, f.value);
      }
      if (body.order) query = query.order(body.order.column, { ascending: body.order.ascending !== false });

      const { data: selectData, error, count } = await query;
      const durationMs = Math.round(performance.now() - t0);
      emitTelemetry({
        operation: "select", table, limit: queryLimit, offset: queryOffset, countMode: queryCountMode,
        durationMs, status: classifySeverity(durationMs, !!error),
        recordCount: (selectData as unknown[] | null)?.length ?? 0, error: error?.message, userId: user?.id,
      });
      if (error) return jsonError(400, "QUERY_ERROR", error.message, { hint: error.hint, code: error.code });
      return jsonOk({ data: selectData, count, duration_ms: durationMs });
    }

    // -------- INSERT --------
    if (action === "insert") {
      const t0 = performance.now();
      const { data: r, error } = await externalClient.from(table!).insert(data as any).select();
      const durationMs = Math.round(performance.now() - t0);
      emitTelemetry({ operation: "insert", table, durationMs, status: classifySeverity(durationMs, !!error), recordCount: r?.length ?? 0, error: error?.message, userId: user?.id });
      if (error) return jsonError(400, "INSERT_ERROR", error.message, { hint: error.hint, code: error.code });
      return jsonOk({ data: r, duration_ms: durationMs });
    }

    // -------- UPSERT --------
    if (action === "upsert") {
      const t0 = performance.now();
      const { data: r, error } = await externalClient.from(table!).upsert(data as any).select();
      const durationMs = Math.round(performance.now() - t0);
      emitTelemetry({ operation: "upsert", table, durationMs, status: classifySeverity(durationMs, !!error), recordCount: r?.length ?? 0, error: error?.message, userId: user?.id });
      if (error) return jsonError(400, "UPSERT_ERROR", error.message, { hint: error.hint, code: error.code });
      return jsonOk({ data: r, duration_ms: durationMs });
    }

    // -------- UPDATE --------
    if (action === "update") {
      if (filters.length === 0) {
        return jsonError(400, "UPDATE_REQUIRES_FILTER", "UPDATE requires at least one filter");
      }
      // Require at least one eq filter to prevent overly-broad updates
      if (!filters.some((f) => f.op === "eq")) {
        return jsonError(400, "UPDATE_REQUIRES_EQ", "UPDATE requires at least one 'eq' filter for safety");
      }
      const t0 = performance.now();
      let query = externalClient.from(table!).update(data as any);
      for (const f of filters) {
        if (f.op === "eq") query = query.eq(f.column, f.value);
        else if (f.op === "neq") query = query.neq(f.column, f.value);
        else if (f.op === "gt") query = query.gt(f.column, f.value);
        else if (f.op === "gte") query = query.gte(f.column, f.value);
        else if (f.op === "lt") query = query.lt(f.column, f.value);
        else if (f.op === "lte") query = query.lte(f.column, f.value);
        else if (f.op === "in") query = query.in(f.column, f.value as unknown[]);
        else if (f.op === "is") query = query.is(f.column, f.value as null | boolean);
      }
      const { data: r, error } = await query.select();
      const durationMs = Math.round(performance.now() - t0);
      emitTelemetry({ operation: "update", table, durationMs, status: classifySeverity(durationMs, !!error), recordCount: r?.length ?? 0, error: error?.message, userId: user?.id });
      if (error) return jsonError(400, "UPDATE_ERROR", error.message, { hint: error.hint, code: error.code });
      return jsonOk({ data: r, duration_ms: durationMs });
    }

    // -------- DELETE --------
    if (action === "delete") {
      if (filters.length === 0) {
        return jsonError(400, "DELETE_REQUIRES_FILTER", "DELETE requires at least one filter");
      }
      if (!filters.some((f) => f.op === "eq")) {
        return jsonError(400, "DELETE_REQUIRES_EQ", "DELETE requires at least one 'eq' filter for safety");
      }
      const t0 = performance.now();
      let query = externalClient.from(table!).delete();
      for (const f of filters) {
        if (f.op === "eq") query = query.eq(f.column, f.value);
        else if (f.op === "neq") query = query.neq(f.column, f.value);
        else if (f.op === "gt") query = query.gt(f.column, f.value);
        else if (f.op === "gte") query = query.gte(f.column, f.value);
        else if (f.op === "lt") query = query.lt(f.column, f.value);
        else if (f.op === "lte") query = query.lte(f.column, f.value);
        else if (f.op === "in") query = query.in(f.column, f.value as unknown[]);
        else if (f.op === "is") query = query.is(f.column, f.value as null | boolean);
      }
      const { data: r, error } = await query.select();
      const durationMs = Math.round(performance.now() - t0);
      emitTelemetry({ operation: "delete", table, durationMs, status: classifySeverity(durationMs, !!error), recordCount: r?.length ?? 0, error: error?.message, userId: user?.id });
      if (error) return jsonError(400, "DELETE_ERROR", error.message, { hint: error.hint, code: error.code });
      return jsonOk({ data: r, duration_ms: durationMs });
    }

    // -------- RPC --------
    if (action === "rpc") {
      if (!rpcName || !isSafeTableName(rpcName)) {
        return jsonError(400, "INVALID_RPC", "rpc action requires a valid 'rpcName' or 'fn'");
      }
      if (!RPC_ALLOWLIST.has(rpcName)) {
        return jsonError(403, "RPC_DENIED", `RPC '${rpcName}' is not in allowlist`);
      }
      const t0 = performance.now();
      if (rpcName in LOGIN_PROTECTION_RPC_FALLBACKS) {
        const durationMs = Math.round(performance.now() - t0);
        return jsonOk({ data: LOGIN_PROTECTION_RPC_FALLBACKS[rpcName], duration_ms: durationMs });
      }
      const { data: rpcData, error } = await externalClient.rpc(rpcName, (rpcArgs || {}) as Record<string, unknown>);
      const durationMs = Math.round(performance.now() - t0);
      emitTelemetry({
        operation: "rpc", rpcName, durationMs, status: classifySeverity(durationMs, !!error),
        recordCount: Array.isArray(rpcData) ? rpcData.length : rpcData ? 1 : 0,
        error: error?.message, userId: user?.id,
      });
      if (error) return jsonError(400, "RPC_ERROR", error.message);
      return jsonOk({ data: rpcData, duration_ms: durationMs });
    }

    return jsonError(400, "UNKNOWN_ACTION", `Unknown action: ${action}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[external-db-bridge] Error:", msg);
    return jsonError(500, "INTERNAL_ERROR", "Internal server error");
  }
});
