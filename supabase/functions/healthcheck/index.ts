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

    const start = Date.now();

    // Check database connectivity
    const { count: colabCount, error: dbError } = await supabase
      .from('colaboradores')
      .select('id', { count: 'exact', head: true });

    const dbLatency = Date.now() - start;

    // Check storage
    const storageStart = Date.now();
    const { error: storageError } = await supabase.storage.listBuckets();
    const storageLatency = Date.now() - storageStart;

    const totalLatency = Date.now() - start;
    const allOk = !dbError && !storageError;

    return new Response(JSON.stringify({
      status: allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: { status: !dbError ? 'ok' : 'error', latency_ms: dbLatency, records: colabCount || 0 },
        storage: { status: !storageError ? 'ok' : 'error', latency_ms: storageLatency },
      },
      total_latency_ms: totalLatency,
    }), {
      status: allOk ? 200 : 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ status: 'error', error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
