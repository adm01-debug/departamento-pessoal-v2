import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { empresaId } = await req.json();

    const [colabs, folha, ferias, afast, esocial] = await Promise.all([
      supabase.from('colaboradores').select('status, departamento', { count: 'exact' }).eq('empresa_id', empresaId || ''),
      supabase.from('folha_pagamento').select('competencia, salario_bruto, salario_liquido').eq('empresa_id', empresaId || '').order('competencia', { ascending: false }).limit(500),
      supabase.from('ferias').select('status').eq('empresa_id', empresaId || ''),
      supabase.from('afastamentos').select('tipo, status').eq('empresa_id', empresaId || ''),
      supabase.from('esocial_eventos').select('status').eq('empresa_id', empresaId || ''),
    ]);

    const ativos = (colabs.data || []).filter((c: any) => c.status === 'ativo').length;
    const deptos = [...new Set((colabs.data || []).map((c: any) => c.departamento).filter(Boolean))];
    const folhaData = folha.data || [];
    const ultimaComp = folhaData[0]?.competencia || null;
    const totalBruto = folhaData.filter((f: any) => f.competencia === ultimaComp).reduce((s: number, f: any) => s + (f.salario_bruto || 0), 0);

    const esocialData = esocial.data || [];
    return new Response(JSON.stringify({
      timestamp: new Date().toISOString(),
      colaboradores: { total: colabs.count || 0, ativos, departamentos: deptos.length },
      folha: { ultima_competencia: ultimaComp, total_bruto: totalBruto },
      ferias: { total: ferias.data?.length || 0 },
      afastamentos: { total: afast.data?.length || 0 },
      esocial: {
        enviados: esocialData.filter((e: any) => e.status === 'enviado').length,
        pendentes: esocialData.filter((e: any) => e.status === 'pendente').length,
        erros: esocialData.filter((e: any) => e.status === 'erro').length,
      },
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
