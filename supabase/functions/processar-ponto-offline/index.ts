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

    const { registros } = await req.json();

    if (!registros || !Array.isArray(registros)) {
      throw new Error('Nenhum registro fornecido');
    }

    const results = { success: 0, errors: 0, details: [] };

    for (const reg of registros) {
      try {
        // Validação de integridade do hash (simulada)
        // Em produção, compararíamos reg.hash com um novo hash gerado no servidor

        const { error } = await supabase.from('batidas_ponto').insert({
          colaborador_id: reg.colaborador_id,
          tipo: reg.tipo === 'entrada' || reg.tipo === 'retorno_almoco' ? 'entrada' : 'saida',
          data: reg.timestamp.split('T')[0],
          hora: reg.timestamp.split('T')[1].split('.')[0].substring(0, 5),
          latitude: reg.latitude,
          longitude: reg.longitude,
          precisao_metros: reg.precisao,
          dispositivo_id: reg.dispositivoId,
          is_offline: true,
          sync_at: new Date().toISOString(),
          hash_integridade: reg.hash,
          metadata: {
            offline_original_type: reg.tipo,
            offline_timestamp: reg.timestamp
          }
        });

        if (error) throw error;
        results.success++;
      } catch (err: any) {
        results.errors++;
        results.details.push({ id: reg.id, error: err.message });
      }
    }

    return new Response(JSON.stringify({ success: true, ...results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
