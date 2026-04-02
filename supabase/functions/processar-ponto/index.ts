import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { colaboradorId, empresaId, data: dataRegistro } = await req.json();

    if (!colaboradorId || !empresaId) {
      return new Response(JSON.stringify({ error: 'colaboradorId e empresaId obrigatórios' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    const dataRef = dataRegistro || new Date().toISOString().split('T')[0];

    // Fetch batidas do dia
    const { data: batidas, error: bErr } = await supabase
      .from('batidas_ponto')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .eq('data', dataRef)
      .order('ordem', { ascending: true });

    if (bErr) throw bErr;

    if (!batidas || batidas.length === 0) {
      return new Response(JSON.stringify({
        success: true, data: dataRef, status: 'sem_registro',
        horas_trabalhadas: '00:00', horas_extras: '00:00', atraso: 0,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get jornada config
    const { data: config } = await supabase
      .from('jornadas')
      .select('*')
      .eq('empresa_id', empresaId)
      .limit(1)
      .maybeSingle();

    const jornadaMinutos = config?.carga_horaria_diaria ? parseFloat(config.carga_horaria_diaria) * 60 : 480; // 8h default
    const tolerancia = config?.tolerancia_minutos || 10;

    // Calculate hours
    function timeToMin(t: string): number {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + (m || 0);
    }

    let totalMinutos = 0;
    for (let i = 0; i < batidas.length - 1; i += 2) {
      const entrada = timeToMin(batidas[i].hora);
      const saida = batidas[i + 1] ? timeToMin(batidas[i + 1].hora) : 0;
      if (saida > entrada) totalMinutos += saida - entrada;
    }

    // Atraso
    const primeiraEntrada = batidas[0]?.hora ? timeToMin(batidas[0].hora) : 0;
    const horaInicioJornada = config?.hora_inicio ? timeToMin(config.hora_inicio) : 480; // 08:00
    let atrasoMin = Math.max(0, primeiraEntrada - horaInicioJornada - tolerancia);

    // Horas extras
    const extrasMin = Math.max(0, totalMinutos - jornadaMinutos - tolerancia);
    const faltaMin = Math.max(0, jornadaMinutos - totalMinutos);

    const hTrab = `${String(Math.floor(totalMinutos / 60)).padStart(2, '0')}:${String(totalMinutos % 60).padStart(2, '0')}`;
    const hExtras = `${String(Math.floor(extrasMin / 60)).padStart(2, '0')}:${String(extrasMin % 60).padStart(2, '0')}`;
    const hFalta = `${String(Math.floor(faltaMin / 60)).padStart(2, '0')}:${String(faltaMin % 60).padStart(2, '0')}`;

    // Upsert registro_ponto
    const registro = {
      colaborador_id: colaboradorId,
      empresa_id: empresaId,
      data: dataRef,
      entrada_1: batidas[0]?.hora || null,
      saida_1: batidas[1]?.hora || null,
      entrada_2: batidas[2]?.hora || null,
      saida_2: batidas[3]?.hora || null,
      horas_trabalhadas: hTrab,
      horas_extras: hExtras,
      horas_falta: hFalta,
      atraso_minutos: atrasoMin,
      status: batidas.length >= 4 ? 'completo' : 'incompleto',
    };

    const { error: uErr } = await supabase.from('registros_ponto').upsert(registro, {
      onConflict: 'colaborador_id,data',
    });

    if (uErr) throw uErr;

    // Handle banco de horas
    if (extrasMin > 0) {
      await supabase.from('banco_horas').insert({
        colaborador_id: colaboradorId,
        empresa_id: empresaId,
        data: dataRef,
        tipo: 'credito',
        horas: hExtras,
        motivo: 'Horas extras processadas automaticamente',
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: dataRef,
      batidas: batidas.length,
      horas_trabalhadas: hTrab,
      horas_extras: hExtras,
      horas_falta: hFalta,
      atraso_minutos: atrasoMin,
      status: registro.status,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
