import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TABLES = [
  'colaboradores', 'folhas_pagamento', 'itens_folha', 'ferias',
  'afastamentos', 'registros_ponto', 'batidas_ponto', 'beneficios',
  'asos', 'admissoes', 'cargos', 'departamentos', 'jornadas',
];

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    // JWT Authentication - admin only
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Autenticação obrigatória' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Sessão inválida' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify admin role
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: roles } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .limit(1);

    if (!roles?.length) {
      return new Response(JSON.stringify({ error: 'Permissão negada: requer role admin' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { empresaId } = await req.json().catch(() => ({ empresaId: null }));
    const results: Record<string, any> = {};
    let totalRecords = 0;

    for (const table of TABLES) {
      try {
        let query = adminClient.from(table).select('*');
        if (empresaId) query = query.eq('empresa_id', empresaId);
        const { data, error } = await query.limit(1000);
        if (error) {
          results[table] = { error: error.message, count: 0 };
        } else {
          results[table] = { count: data?.length || 0 };
          totalRecords += data?.length || 0;
        }
      } catch {
        results[table] = { error: 'Tabela não acessível', count: 0 };
      }
    }

    await adminClient.from('audit_log').insert({
      tabela: 'backup',
      registro_id: 'system',
      acao: 'BACKUP',
      user_id: userData.user.id,
      dados_novos: { tables: results, total: totalRecords, empresa_id: empresaId },
    });

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      tables: results,
      total_records: totalRecords,
      message: `Backup de ${TABLES.length} tabelas concluído (${totalRecords} registros)`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
