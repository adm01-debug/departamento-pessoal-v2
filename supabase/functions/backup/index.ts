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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { empresaId } = await req.json();
    const results: Record<string, any> = {};
    let totalRecords = 0;

    for (const table of TABLES) {
      try {
        let query = supabase.from(table).select('*');
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

    await supabase.from('audit_log').insert({
      tabela: 'backup',
      registro_id: 'system',
      acao: 'BACKUP',
      dados_novos: { tables: results, total: totalRecords },
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
