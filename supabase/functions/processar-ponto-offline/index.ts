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
        
        // 1. Prevenção de duplicidade offline (mesmo colaborador, data e hora)
        const timestampDate = reg.timestamp.split('T')[0];
        const timestampTime = reg.timestamp.split('T')[1].split('.')[0].substring(0, 5);
        const tipoMapped = reg.tipo === 'entrada' || reg.tipo === 'retorno_almoco' ? 'entrada' : 'saida';

        const { data: duplicate } = await supabase
          .from('batidas_ponto')
          .select('id')
          .eq('colaborador_id', reg.colaborador_id)
          .eq('data', timestampDate)
          .eq('hora', timestampTime)
          .eq('tipo', tipoMapped)
          .maybeSingle();

        if (duplicate) {
          results.success++; // Já existe, consideramos sucesso para limpar da fila
          continue;
        }

        // Se houver foto em base64, fazer upload para o storage no servidor
        let finalFotoUrl = null;
        if (reg.foto_base64 && reg.colaborador_id) {
          const fileName = `${reg.colaborador_id}/offline-${Date.now()}.jpg`;
          const binary = Uint8Array.from(atob(reg.foto_base64.split(',')[1]), c => c.charCodeAt(0));
          
          const { error: storageError } = await supabase.storage
            .from('ponto-biometria')
            .upload(fileName, binary, { contentType: 'image/jpeg' });
            
          if (!storageError) {
            const { data: { publicUrl } } = supabase.storage.from('ponto-biometria').getPublicUrl(fileName);
            finalFotoUrl = publicUrl;
          }
        }

        const { error } = await supabase.from('batidas_ponto').insert({
          colaborador_id: reg.colaborador_id,
          tipo: tipoMapped,
          data: timestampDate,
          hora: timestampTime,
          latitude: reg.latitude,
          longitude: reg.longitude,
          precisao_metros: reg.precisao,
          dispositivo_id: reg.dispositivoId,
          is_offline: true,
          sync_at: new Date().toISOString(),
          hash_integridade: reg.hash,
          foto_biometria_url: finalFotoUrl,
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
