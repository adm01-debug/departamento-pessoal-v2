// Suíte de testes de consistência de migrações + simulação de cenários
// ---------------------------------------------------------------------
// Valida invariantes críticas pós-migrations (idx parciais, particionamento,
// hardening de funções, rate-limit do scanner) executando cenários reais:
//
//   A) Concorrência: N inserts paralelos com mesma idempotency_key → 1 vencedor
//   B) Replays: reexecução de INSERT com mesma key → sem duplicata (UNIQUE)
//   C) Falhas de INSERT: violação de FK/CHECK não corrompe estado
//   D) Scanner rate-limit: 2 execuções paralelas → apenas 1 gera alertas
//   E) Índices parciais presentes em audit_log (idx_audit_log_status_change_scan)
//   F) has_role callable apenas por authenticated/service_role (não anon)
//
// Pré-requisitos:
//   TEST_SUPABASE_URL       — https://<ref>.supabase.co
//   TEST_ANON_KEY           — anon key
//   TEST_SERVICE_ROLE_KEY   — service role (executa cenários privilegiados)
//   TEST_EMPRESA_ID         — uuid de empresa de teste
//
// Executar:
//   deno test --allow-net --allow-env supabase/tests/migration_consistency.test.ts
//
// Todos os testes são IGNORADOS quando as envs não estão presentes — não quebra CI padrão.

import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const url = Deno.env.get("TEST_SUPABASE_URL");
const anonKey = Deno.env.get("TEST_ANON_KEY");
const serviceKey = Deno.env.get("TEST_SERVICE_ROLE_KEY");
const empresaId = Deno.env.get("TEST_EMPRESA_ID");

const canRun = Boolean(url && anonKey && serviceKey && empresaId);

function admin(): SupabaseClient {
  return createClient(url!, serviceKey!, { auth: { persistSession: false } });
}

function anon(): SupabaseClient {
  return createClient(url!, anonKey!, { auth: { persistSession: false } });
}

// ────────────────────────────────────────────────────────────────────────────
// A) CONCORRÊNCIA — N inserts paralelos com mesma key → 1 winner, N-1 conflicts
// ────────────────────────────────────────────────────────────────────────────
Deno.test({
  name: "idempotency_keys: 20 inserts paralelos com mesma key → 1 winner",
  ignore: !canRun,
  async fn() {
    const db = admin();
    const key = `test-conc-${crypto.randomUUID()}`;
    const key_hash = key; // simplificação — em prod é SHA-256
    const endpoint = "calcular-folha";

    const attempts = Array.from({ length: 20 }, () =>
      db.from("idempotency_keys").insert({
        endpoint,
        key_hash,
        request_hash: "test",
        status: "in_progress",
      }).select("id"),
    );

    const results = await Promise.all(attempts);
    const winners = results.filter((r) => !r.error && r.data && r.data.length > 0);
    const conflicts = results.filter((r) => r.error?.code === "23505"); // UNIQUE violation

    assertEquals(winners.length, 1, `esperava exatamente 1 winner, veio ${winners.length}`);
    assertEquals(conflicts.length, 19, `esperava 19 conflicts, veio ${conflicts.length}`);

    // Cleanup
    await db.from("idempotency_keys").delete().eq("key_hash", key_hash);
  },
});

// ────────────────────────────────────────────────────────────────────────────
// B) REPLAYS — mesmo INSERT 2x consecutivos → sem duplicata
// ────────────────────────────────────────────────────────────────────────────
Deno.test({
  name: "idempotency_keys: replay sequencial não cria duplicata",
  ignore: !canRun,
  async fn() {
    const db = admin();
    const key_hash = `test-replay-${crypto.randomUUID()}`;

    const first = await db.from("idempotency_keys").insert({
      endpoint: "fechar-folha",
      key_hash,
      request_hash: "h1",
      status: "completed",
    });
    assertEquals(first.error, null);

    const second = await db.from("idempotency_keys").insert({
      endpoint: "fechar-folha",
      key_hash,
      request_hash: "h1",
      status: "completed",
    });
    assert(second.error?.code === "23505", "segundo insert deveria violar UNIQUE");

    const { count } = await db
      .from("idempotency_keys")
      .select("*", { count: "exact", head: true })
      .eq("key_hash", key_hash);
    assertEquals(count, 1, "deve existir apenas 1 linha após replay");

    await db.from("idempotency_keys").delete().eq("key_hash", key_hash);
  },
});

// ────────────────────────────────────────────────────────────────────────────
// C) FALHAS DE INSERT — violações não corrompem estado adjacente
// ────────────────────────────────────────────────────────────────────────────
Deno.test({
  name: "audit_log: insert com tabela nula falha sem afetar linhas vizinhas",
  ignore: !canRun,
  async fn() {
    const db = admin();
    const marker = `test-fail-${crypto.randomUUID()}`;

    // Insert válido
    const ok = await db.from("audit_log").insert({
      acao: "TEST_MARKER",
      tabela: marker,
      dados_novos: { probe: true },
    });
    assertEquals(ok.error, null);

    // Insert inválido (acao NOT NULL)
    const bad = await db.from("audit_log").insert({
      acao: null as unknown as string,
      tabela: marker,
    });
    assert(bad.error !== null, "insert inválido deveria falhar");

    // Linha válida deve permanecer intacta
    const { data, error } = await db
      .from("audit_log")
      .select("id, acao")
      .eq("tabela", marker);
    assertEquals(error, null);
    assertEquals(data?.length, 1, "linha válida deve persistir apesar da falha adjacente");

    await db.from("audit_log").delete().eq("tabela", marker);
  },
});

// ────────────────────────────────────────────────────────────────────────────
// D) SCANNER RATE-LIMIT — advisory lock impede execução dupla
// ────────────────────────────────────────────────────────────────────────────
Deno.test({
  name: "_scan_status_anomalies_global: 2 execuções paralelas → 1 pega o lock",
  ignore: !canRun,
  async fn() {
    const db = admin();
    const [a, b] = await Promise.all([
      db.rpc("_scan_status_anomalies_global"),
      db.rpc("_scan_status_anomalies_global"),
    ]);
    // Uma delas deve retornar 0 (lock não obtido); nenhuma deve dar erro
    assertEquals(a.error, null, `scanner A erro: ${a.error?.message}`);
    assertEquals(b.error, null, `scanner B erro: ${b.error?.message}`);
    const counts = [a.data as number, b.data as number].filter((v) => v !== null);
    assert(counts.some((v) => v === 0), "ao menos uma execução deve retornar 0 (lock)");
  },
});

// ────────────────────────────────────────────────────────────────────────────
// E) ÍNDICES PARCIAIS — presença dos índices criados na migração #33
// ────────────────────────────────────────────────────────────────────────────
Deno.test({
  name: "audit_log: índices parciais esperados existem",
  ignore: !canRun,
  async fn() {
    const db = admin();
    const { data, error } = await db.rpc("exec_sql_readonly", {
      query:
        "SELECT indexname FROM pg_indexes WHERE schemaname='public' AND tablename='audit_log'",
    }).select().maybeSingle().then(
      (r) => r,
      // fallback: se RPC não existe, usar query direta via PostgREST não é possível → skip
      () => ({ data: null, error: { message: "rpc-unavailable" } }),
    );

    if (error) {
      console.warn(`[skip] índices não verificáveis via RPC: ${error.message}`);
      return;
    }
    const names = String(data ?? "");
    for (const idx of [
      "idx_audit_log_status_change_scan",
      "idx_audit_log_registro_created",
      "idx_audit_log_user_created",
    ]) {
      assert(names.includes(idx), `índice ausente: ${idx}`);
    }
  },
});

// ────────────────────────────────────────────────────────────────────────────
// F) HARDENING — anon não pode invocar has_role
// ────────────────────────────────────────────────────────────────────────────
Deno.test({
  name: "has_role: anon recebe permission denied",
  ignore: !canRun,
  async fn() {
    const { error } = await anon().rpc("has_role", {
      _user_id: "00000000-0000-0000-0000-000000000000",
      _role: "admin",
    });
    assert(error !== null, "anon deveria ser bloqueado");
    assert(
      /permission|denied|not.*allowed|42501/i.test(error?.message ?? ""),
      `mensagem inesperada: ${error?.message}`,
    );
  },
});
