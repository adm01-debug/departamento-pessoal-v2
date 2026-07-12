import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { integrityHash, sha256Hex } from '../_shared/integrityHash.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HMAC-SHA256 usando segredo compartilhado com o cliente (opcional).
// Se PONTO_HASH_SECRET não estiver definido, usa SHA-256 canônico (compat legado).
async function computeExpectedHash(payload: {
  colaborador_id: string;
  timestamp: string;
  tipo: string;
  dispositivoId: string;
}): Promise<string> {
  const secret = Deno.env.get('PONTO_HASH_SECRET') ?? '';
  const canonical = `${payload.colaborador_id}|${payload.timestamp}|${payload.tipo}|${payload.dispositivoId}`;
  if (!secret) return sha256Hex(canonical);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Comparação constant-time
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { registros } = await req.json();
    if (!registros || !Array.isArray(registros)) {
      throw new Error('Nenhum registro fornecido');
    }

    // Enforcement de assinatura só é obrigatório quando o segredo está configurado
    const enforceHash = !!Deno.env.get('PONTO_HASH_SECRET');

    const results: {
      success: number;
      errors: number;
      rejected_invalid_hash: number;
      details: Array<{ id?: string; error: string; code?: string }>;
      batch_integrity_hash?: string;
    } = { success: 0, errors: 0, rejected_invalid_hash: 0, details: [] };

    const processedIds: string[] = [];

    for (const reg of registros) {
      try {
        if (!reg?.colaborador_id || !reg?.timestamp || !reg?.tipo || !reg?.dispositivoId) {
          throw new Error('Campos obrigatórios ausentes (colaborador_id, timestamp, tipo, dispositivoId)');
        }

        // 1. Validação de integridade real (HMAC quando segredo configurado)
        const expected = await computeExpectedHash({
          colaborador_id: reg.colaborador_id,
          timestamp: reg.timestamp,
          tipo: reg.tipo,
          dispositivoId: reg.dispositivoId,
        });

        if (enforceHash) {
          if (!reg.hash || !safeEqual(String(reg.hash), expected)) {
            results.rejected_invalid_hash++;
            results.errors++;
            results.details.push({
              id: reg.id,
              error: 'Assinatura de integridade inválida',
              code: 'INVALID_SIGNATURE',
            });
            continue;
          }
        }

        const timestampDate = reg.timestamp.split('T')[0];
        const timestampTime = reg.timestamp.split('T')[1].split('.')[0].substring(0, 5);
        const tipoMapped = reg.tipo === 'entrada' || reg.tipo === 'retorno_almoco' ? 'entrada' : 'saida';

        // 2. Deduplicação (idempotência natural por (colaborador, data, hora, tipo))
        const { data: duplicate } = await supabase
          .from('batidas_ponto')
          .select('id')
          .eq('colaborador_id', reg.colaborador_id)
          .eq('data', timestampDate)
          .eq('hora', timestampTime)
          .eq('tipo', tipoMapped)
          .maybeSingle();

        if (duplicate) {
          results.success++;
          processedIds.push(String(duplicate.id));
          continue;
        }

        // 3. Upload seguro de foto (opcional)
        let finalFotoUrl: string | null = null;
        if (reg.foto_base64 && reg.colaborador_id) {
          const fileName = `${reg.colaborador_id}/offline-${Date.now()}.jpg`;
          const parts = String(reg.foto_base64).split(',');
          const b64 = parts.length > 1 ? parts[1] : parts[0];
          try {
            const binary = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
            const { error: storageError } = await supabase.storage
              .from('ponto-biometria')
              .upload(fileName, binary, { contentType: 'image/jpeg' });
            if (!storageError) {
              const { data: pub } = supabase.storage.from('ponto-biometria').getPublicUrl(fileName);
              finalFotoUrl = pub.publicUrl;
            }
          } catch {
            // foto inválida não bloqueia a batida
          }
        }

        const { data: inserted, error } = await supabase
          .from('batidas_ponto')
          .insert({
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
            hash_integridade: expected, // sempre grava o hash canônico calculado no servidor
            foto_biometria_url: finalFotoUrl,
            metadata: {
              offline_original_type: reg.tipo,
              offline_timestamp: reg.timestamp,
              client_hash: reg.hash ?? null,
              hash_enforced: enforceHash,
            },
          })
          .select('id')
          .maybeSingle();

        if (error) throw error;
        if (inserted?.id) processedIds.push(String(inserted.id));
        results.success++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.errors++;
        results.details.push({ id: reg?.id, error: msg });
      }
    }

    results.batch_integrity_hash = await integrityHash({
      total: registros.length,
      success: results.success,
      errors: results.errors,
      rejected_invalid_hash: results.rejected_invalid_hash,
      processed_ids: processedIds.sort(),
      enforce_hash: enforceHash,
    });

    return new Response(JSON.stringify({ success: true, ...results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
