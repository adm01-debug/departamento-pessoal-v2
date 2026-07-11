// Onda 14 — Endurecimento: Zod + Auth + Tenant scope + CORS uniformes
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';
import { captureException } from '../_shared/sentry.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const BodySchema = z.object({
  action: z.enum(['colaboradores', 'folha']),
  format: z.enum(['csv', 'json']).default('json'),
  empresaId: z.string().uuid().optional(),
  filters: z.object({
    status: z.string().max(50).optional(),
    competencia: z.string().max(20).optional(),
  }).optional(),
});

function csvEscape(v: unknown): string {
  const s = v == null ? '' : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    // 1) Auth obrigatório
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return jsonResponse({ error: 'Autenticação obrigatória' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return jsonResponse({ error: 'Sessão inválida' }, 401);
    const userId = userData.user.id;

    // 2) Validação Zod
    let raw: unknown;
    try { raw = await req.json(); } catch { return jsonResponse({ error: 'JSON inválido' }, 400); }
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return jsonResponse({ error: 'Payload inválido', details: parsed.error.flatten() }, 400);
    }
    const { action, format, empresaId, filters } = parsed.data;

    // 3) Tenant scope
    const admin = createClient(supabaseUrl, serviceKey);
    if (empresaId) {
      const { data: belongs } = await admin.rpc('user_belongs_to_empresa', {
        _user_id: userId, _empresa_id: empresaId,
      });
      const { data: isAdm } = await admin.rpc('is_admin', { _user_id: userId });
      if (!belongs && !isAdm) return jsonResponse({ error: 'Sem acesso a esta empresa' }, 403);
    }

    // 4) Handlers
    if (action === 'colaboradores') {
      let q = admin.from('colaboradores')
        .select('nome_completo, cpf, cargo, departamento, data_admissao, salario, status, email, telefone')
        .limit(10000);
      if (empresaId) q = q.eq('empresa_id', empresaId);
      if (filters?.status) q = q.eq('status', filters.status);
      const { data, error } = await q;
      if (error) throw error;

      // Audit log
      await admin.from('audit_log').insert({
        tabela: 'colaboradores', registro_id: 'export', acao: 'EXPORT',
        user_id: userId,
        dados_novos: { total: data?.length ?? 0, format, empresa_id: empresaId ?? null },
      });

      if (format === 'csv') {
        const hdr = 'Nome,CPF,Cargo,Departamento,Admissão,Salário,Status,Email,Telefone';
        const rows = (data || []).map((c: any) =>
          [c.nome_completo, c.cpf, c.cargo, c.departamento, c.data_admissao, c.salario, c.status, c.email, c.telefone].map(csvEscape).join(',')
        );
        return new Response([hdr, ...rows].join('\n'), {
          headers: { ...corsHeaders, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="colaboradores.csv"' },
        });
      }
      return jsonResponse({ data, total: data?.length ?? 0 });
    }

    if (action === 'folha') {
      let q = admin.from('folhas_pagamento')
        .select('*, colaborador:colaboradores(nome_completo, cpf)')
        .limit(10000);
      if (empresaId) q = q.eq('empresa_id', empresaId);
      if (filters?.competencia) q = q.eq('competencia', filters.competencia);
      const { data, error } = await q;
      if (error) throw error;

      await admin.from('audit_log').insert({
        tabela: 'folhas_pagamento', registro_id: 'export', acao: 'EXPORT',
        user_id: userId,
        dados_novos: { total: data?.length ?? 0, format, empresa_id: empresaId ?? null },
      });

      if (format === 'csv') {
        const hdr = 'Nome,CPF,Competência,Bruto,INSS,IRRF,FGTS,Líquido';
        const rows = (data || []).map((f: any) =>
          [f.colaborador?.nome_completo, f.colaborador?.cpf, f.competencia, f.salario_bruto, f.desconto_inss, f.desconto_irrf, f.fgts, f.salario_liquido].map(csvEscape).join(',')
        );
        return new Response([hdr, ...rows].join('\n'), {
          headers: { ...corsHeaders, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="folha.csv"' },
        });
      }
      return jsonResponse({ data, total: data?.length ?? 0 });
    }

    return jsonResponse({ error: 'Ação inválida' }, 400);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    try { captureException(error, { fn: 'exportacao' }); } catch { /* noop */ }
    return jsonResponse({ error: message }, 500);
  }
});
