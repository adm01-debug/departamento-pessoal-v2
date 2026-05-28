import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { validateRequest, corsHeaders, createErrorResponse } from '../_shared/contract.ts';
import { metricasSchema } from '../_shared/schemas/common.ts';
import { withMonitoring } from '../_shared/monitor.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  return withMonitoring(req, 'metricas', async (supabase) => {
    const { data, errorResponse } = await validateRequest(req, metricasSchema);
    if (errorResponse) return errorResponse;

    const { empresaId } = data!;

    const [colabs, folha, ferias, afast, esocial, processing] = await Promise.all([
      supabase.from('colaboradores').select('status, departamento', { count: 'exact' }).eq('empresa_id', empresaId || ''),
      supabase.from('folhas_pagamento').select('competencia, salario_bruto, salario_liquido').eq('empresa_id', empresaId || '').order('competencia', { ascending: false }).limit(500),
      supabase.from('ferias').select('status').eq('empresa_id', empresaId || ''),
      supabase.from('afastamentos').select('tipo, status').eq('empresa_id', empresaId || ''),
      supabase.from('esocial_eventos').select('status').eq('empresa_id', empresaId || ''),
      supabase.from('metricas_processamento').select('*').order('timestamp', { ascending: false }).limit(100)
    ]);

    const ativos = (colabs.data || []).filter((c: any) => c.status === 'ativo').length;
    const deptos = [...new Set((colabs.data || []).map((c: any) => c.departamento).filter(Boolean))];
    const folhaData = folha.data || [];
    const ultimaComp = folhaData[0]?.competencia || null;
    const totalBruto = folhaData.filter((f: any) => f.competencia === ultimaComp).reduce((s: number, f: any) => s + (f.salario_bruto || 0), 0);

    const esocialData = esocial.data || [];
    const processingData = processing.data || [];
    
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
      monitoring: {
        avg_latency: processingData.reduce((acc: number, curr: any) => acc + curr.tempo_execucao_ms, 0) / (processingData.length || 1),
        success_rate: (processingData.filter((p: any) => p.status === 'success').length / (processingData.length || 1)) * 100,
        recent_failures: processingData.filter((p: any) => p.status !== 'success').length
      }
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  });
});

