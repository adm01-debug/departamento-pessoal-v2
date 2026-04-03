import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action } = await req.json();

    // Get Bitrix24 config
    const { data: config, error: cfgErr } = await supabase
      .from('bitrix24_config')
      .select('*')
      .limit(1)
      .single();

    if (cfgErr && cfgErr.code !== 'PGRST116') throw cfgErr;

    if (!config || !config.habilitado) {
      return new Response(JSON.stringify({ success: false, error: 'Integração Bitrix24 não está habilitada' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    if (!config.webhook_url) {
      return new Response(JSON.stringify({ success: false, error: 'URL do webhook Bitrix24 não configurada' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    const results: Record<string, any> = { timestamp: new Date().toISOString() };
    let totalProcessed = 0;
    let totalErrors = 0;
    let totalSuccess = 0;

    if (action === 'sync_departamentos' || action === 'sync_all') {
      if (config.sync_departamentos) {
        try {
          const resp = await fetch(`${config.webhook_url}/department.get`);
          if (!resp.ok) throw new Error(`Bitrix API error: ${resp.status}`);
          const bitrixData = await resp.json();
          const departments = bitrixData.result || [];

          for (const dept of departments) {
            const { error } = await supabase.from('departamentos').upsert({
              nome: dept.NAME,
              ativo: dept.ACTIVE === 'Y',
            }, { onConflict: 'nome' });
            if (error) totalErrors++;
            else totalSuccess++;
            totalProcessed++;
          }
          results.departamentos = { processed: departments.length };
        } catch (e: any) {
          results.departamentos = { error: e.message };
          totalErrors++;
        }
      }
    }

    if (action === 'sync_colaboradores' || action === 'sync_all') {
      if (config.sync_colaboradores) {
        try {
          const resp = await fetch(`${config.webhook_url}/user.get?ACTIVE=true`);
          if (!resp.ok) throw new Error(`Bitrix API error: ${resp.status}`);
          const bitrixData = await resp.json();
          const users = bitrixData.result || [];
          results.colaboradores = { found: users.length, note: 'Sync requires manual mapping' };
          totalProcessed += users.length;
        } catch (e: any) {
          results.colaboradores = { error: e.message };
          totalErrors++;
        }
      }
    }

    if (action === 'sync_cargos' || action === 'sync_all') {
      if (config.sync_cargos) {
        try {
          // Bitrix doesn't have a direct "positions" API — use custom field or department hierarchy
          results.cargos = { note: 'Cargos sync requires custom Bitrix24 field mapping' };
        } catch (e: any) {
          results.cargos = { error: e.message };
        }
      }
    }

    if (action === 'status') {
      return new Response(JSON.stringify({
        success: true,
        data: {
          habilitado: config.habilitado,
          webhook_configurado: !!config.webhook_url,
          sync_departamentos: config.sync_departamentos,
          sync_colaboradores: config.sync_colaboradores,
          sync_cargos: config.sync_cargos,
          ultima_execucao: config.ultima_execucao,
          proxima_execucao: config.proxima_execucao,
        },
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Log sync result
    await supabase.from('bitrix24_sync_logs').insert({
      tipo: action || 'manual',
      direcao: 'bitrix_to_local',
      registros_processados: totalProcessed,
      registros_sucesso: totalSuccess,
      registros_erro: totalErrors,
      detalhes: results,
    });

    // Update last execution
    await supabase.from('bitrix24_config').update({
      ultima_execucao: new Date().toISOString(),
    }).eq('id', config.id);

    return new Response(JSON.stringify({
      success: true,
      data: { ...results, totals: { processed: totalProcessed, success: totalSuccess, errors: totalErrors } },
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
