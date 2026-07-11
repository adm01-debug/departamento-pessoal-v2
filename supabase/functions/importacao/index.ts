// Onda 13 — Endurecimento: Zod + Auth + Tenant scope + logs padronizados
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';
import { captureException } from '../_shared/sentry.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Whitelist rígida — protege contra SQL/table injection via body param
const ALLOWED_TABLES = [
  'colaboradores', 'departamentos', 'cargos', 'beneficios',
  'dependentes', 'contatos_emergencia', 'documentos',
] as const;

const BodySchema = z.object({
  action: z.enum(['validar', 'importar', 'template']),
  tabela: z.enum(ALLOWED_TABLES),
  formato: z.enum(['csv', 'json']).optional(),
  csvContent: z.string().max(5 * 1024 * 1024).optional(), // 5MB
  dados: z.union([z.array(z.record(z.unknown())), z.record(z.unknown())]).optional(),
  empresaId: z.string().uuid().optional(),
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length !== headers.length) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx]; });
    rows.push(row);
  }
  return rows;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ success: false, error: 'Method not allowed' }, 405);

  try {
    // 1) Auth obrigatório — extrai user do JWT
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return jsonResponse({ success: false, error: 'Autenticação obrigatória' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return jsonResponse({ success: false, error: 'Sessão inválida' }, 401);
    }
    const userId = userData.user.id;

    // 2) Validação de input via Zod
    let raw: unknown;
    try { raw = await req.json(); } catch { return jsonResponse({ success: false, error: 'JSON inválido' }, 400); }
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return jsonResponse({ success: false, error: 'Payload inválido', details: parsed.error.flatten() }, 400);
    }
    const { action, tabela, dados, formato, csvContent, empresaId } = parsed.data;

    // 3) Tenant scope — se empresaId fornecido, exigir vínculo do usuário
    const admin = createClient(supabaseUrl, serviceKey);
    if (empresaId) {
      const { data: belongs } = await admin.rpc('user_belongs_to_empresa', {
        _user_id: userId, _empresa_id: empresaId,
      });
      const { data: isAdm } = await admin.rpc('is_admin', { _user_id: userId });
      if (!belongs && !isAdm) {
        return jsonResponse({ success: false, error: 'Sem acesso a esta empresa' }, 403);
      }
    }

    // 4) Handlers por ação
    if (action === 'template') {
      const templates: Record<string, string> = {
        colaboradores: 'nome,cpf,email,telefone,data_nascimento,data_admissao,cargo,departamento,salario',
        departamentos: 'nome,descricao',
        cargos: 'nome,cbo,salario_base',
        beneficios: 'nome,tipo,valor,valor_empresa,valor_colaborador',
      };
      return jsonResponse({ success: true, data: { template: templates[tabela] ?? '', tabela } });
    }

    // Materializa as linhas
    let rows: Record<string, unknown>[] = [];
    if (formato === 'csv' && csvContent) rows = parseCSV(csvContent);
    else if (dados) rows = Array.isArray(dados) ? dados as Record<string, unknown>[] : [dados as Record<string, unknown>];
    else return jsonResponse({ success: false, error: 'Forneça csvContent (csv) ou dados (json)' }, 400);

    if (action === 'validar') {
      const errors: string[] = [];
      rows.forEach((row, idx) => {
        if (tabela === 'colaboradores') {
          if (!row.nome) errors.push(`Linha ${idx + 1}: nome é obrigatório`);
          if (!row.cpf && !row.email) errors.push(`Linha ${idx + 1}: cpf ou email é obrigatório`);
        }
        if (tabela === 'departamentos' && !row.nome) errors.push(`Linha ${idx + 1}: nome é obrigatório`);
      });
      return jsonResponse({
        success: true,
        data: { total: rows.length, errors, valid: errors.length === 0, preview: rows.slice(0, 5) },
      });
    }

    // action === 'importar'
    if (rows.length === 0) return jsonResponse({ success: false, error: 'Nenhum dado para importar' }, 400);
    if (rows.length > 5000) return jsonResponse({ success: false, error: 'Máximo 5000 linhas por importação' }, 400);
    if (empresaId) rows = rows.map(r => ({ ...r, empresa_id: empresaId }));

    let inserted = 0, errorsCount = 0;
    const batchErrors: string[] = [];
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const { data, error } = await admin.from(tabela).insert(batch).select('id');
      if (error) {
        errorsCount += batch.length;
        batchErrors.push(`Batch ${Math.floor(i / 50) + 1}: ${error.message}`);
      } else {
        inserted += data?.length ?? 0;
      }
    }

    await admin.from('audit_log').insert({
      tabela,
      registro_id: 'bulk-import',
      acao: 'IMPORT',
      user_id: userId,
      dados_novos: { total: rows.length, inserted, errors: errorsCount, empresa_id: empresaId ?? null },
    });

    return jsonResponse({
      success: true,
      data: { total: rows.length, inserted, errors: errorsCount, details: batchErrors },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    try { captureException(error); } catch { /* noop */ }
    return jsonResponse({ success: false, error: message }, 500);
  }
});
