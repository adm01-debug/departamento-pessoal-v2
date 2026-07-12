// Onda 24 — Hardening avançado: CSRF + anti CSV-injection + BOM UTF-8 +
// filtros restritos por regex + paginação sinalizada + tenant scope estrito.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';
import { corsHeaders, createErrorResponse, createValidationErrorResponse } from '../_shared/contract.ts';
import { verifyCsrf } from '../_shared/csrf.ts';
import { captureException } from '../_shared/sentry.ts';

const HARD_CAP = 10_000;

const BodySchema = z.object({
  action: z.enum(['colaboradores', 'folha']),
  format: z.enum(['csv', 'json']).default('json'),
  empresaId: z.string().uuid().optional(),
  filters: z.object({
    // Regex restritivo evita valores exóticos passados adiante
    status: z.string().regex(/^[a-z_]{1,32}$/i).optional(),
    competencia: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  }).optional(),
});

const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return '""';
  let s = String(v);
  // Anti CSV-injection
  if (s.length > 0 && FORMULA_PREFIXES.includes(s[0])) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function csvResponse(csv: string, filename: string): Response {
  // BOM UTF-8 para Excel abrir acentos corretamente
  const body = '\uFEFF' + csv;
  return new Response(body, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== 'POST') return createErrorResponse('Método não permitido', 405, 'METHOD_NOT_ALLOWED');

  try {
    const csrf = await verifyCsrf(req.clone());
    if (!csrf.ok) return csrf.response!;

    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return createErrorResponse('Autenticação obrigatória', 401, 'UNAUTHORIZED');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return createErrorResponse('Sessão inválida', 401, 'UNAUTHORIZED');
    const userId = userData.user.id;

    let raw: unknown;
    try { raw = await req.json(); } catch { return createErrorResponse('JSON inválido', 400, 'INVALID_JSON'); }
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) return createValidationErrorResponse(parsed.error);
    const { action, format, empresaId, filters } = parsed.data;

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Tenant scope — exigir empresaId; sem empresa = apenas admin pode exportar tudo
    const { data: isAdm } = await admin.rpc('is_admin', { _user_id: userId });
    if (!empresaId && !isAdm) {
      return createErrorResponse('empresaId é obrigatório', 400, 'EMPRESA_REQUIRED');
    }
    if (empresaId) {
      const { data: belongs } = await admin.rpc('user_belongs_to_empresa', {
        _user_id: userId, _empresa_id: empresaId,
      });
      if (!belongs && !isAdm) return createErrorResponse('Sem acesso a esta empresa', 403, 'FORBIDDEN');
    }

    if (action === 'colaboradores') {
      let q = admin.from('colaboradores')
        .select('nome_completo, cpf, cargo, departamento, data_admissao, salario, status, email, telefone')
        .limit(HARD_CAP + 1); // +1 para detectar truncamento
      if (empresaId) q = q.eq('empresa_id', empresaId);
      if (filters?.status) q = q.eq('status', filters.status);
      const { data, error } = await q;
      if (error) throw error;

      const truncated = (data?.length ?? 0) > HARD_CAP;
      const rows = truncated ? (data ?? []).slice(0, HARD_CAP) : (data ?? []);

      await admin.from('audit_log').insert({
        tabela: 'colaboradores', registro_id: crypto.randomUUID(), acao: 'EXPORT',
        user_id: userId,
        dados_novos: { total: rows.length, format, empresa_id: empresaId ?? null, truncated },
      });

      if (format === 'csv') {
        const hdr = 'Nome,CPF,Cargo,Departamento,Admissão,Salário,Status,Email,Telefone';
        const csvRows = rows.map((c: any) =>
          [c.nome_completo, c.cpf, c.cargo, c.departamento, c.data_admissao, c.salario, c.status, c.email, c.telefone]
            .map(csvEscape).join(',')
        );
        return csvResponse([hdr, ...csvRows].join('\r\n'), 'colaboradores.csv');
      }
      return json({ data: rows, total: rows.length, truncated });
    }

    if (action === 'folha') {
      let q = admin.from('folhas_pagamento')
        .select('*, colaborador:colaboradores(nome_completo, cpf)')
        .limit(HARD_CAP + 1);
      if (empresaId) q = q.eq('empresa_id', empresaId);
      if (filters?.competencia) q = q.eq('competencia', filters.competencia);
      const { data, error } = await q;
      if (error) throw error;

      const truncated = (data?.length ?? 0) > HARD_CAP;
      const rows = truncated ? (data ?? []).slice(0, HARD_CAP) : (data ?? []);

      await admin.from('audit_log').insert({
        tabela: 'folhas_pagamento', registro_id: crypto.randomUUID(), acao: 'EXPORT',
        user_id: userId,
        dados_novos: { total: rows.length, format, empresa_id: empresaId ?? null, truncated },
      });

      if (format === 'csv') {
        const hdr = 'Nome,CPF,Competência,Bruto,INSS,IRRF,FGTS,Líquido';
        const csvRows = rows.map((f: any) =>
          [f.colaborador?.nome_completo, f.colaborador?.cpf, f.competencia,
           f.salario_bruto, f.desconto_inss, f.desconto_irrf, f.fgts, f.salario_liquido]
            .map(csvEscape).join(',')
        );
        return csvResponse([hdr, ...csvRows].join('\r\n'), 'folha.csv');
      }
      return json({ data: rows, total: rows.length, truncated });
    }

    return createErrorResponse('Ação inválida', 400, 'INVALID_ACTION');
  } catch (error: unknown) {
    try { captureException(error, { fn: 'exportacao' }); } catch { /* noop */ }
    return createErrorResponse('Erro interno', 500, 'INTERNAL_SERVER_ERROR');
  }
});
