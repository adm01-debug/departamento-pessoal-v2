import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Rate limiting
 * Edge Function otimizada para baixa latência
 */

interface RequestBody { 
  key: string; 
  limit: number; 
  window_seconds: number; 
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { key, limit, window_seconds }: RequestBody = await req.json();
    
    if (!key) throw new Error('Key is required');

    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - (window_seconds || 60);

    // Limpa registros antigos (Buckets deslizantes)
    await supabase.from('rate_limits')
      .delete()
      .lt('timestamp', windowStart);

    // Conta requisições na janela atual
    const { count, error: countError } = await supabase
      .from('rate_limits')
      .select('id', { count: 'exact', head: true })
      .eq('key', key)
      .gte('timestamp', windowStart);

    if (countError) throw countError;

    const currentCount = count || 0;
    const allowed = currentCount < (limit || 100);

    if (allowed) {
      await supabase.from('rate_limits').insert({
        key,
        timestamp: now
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        allowed, 
        remaining: Math.max(0, (limit || 100) - currentCount - (allowed ? 1 : 0)),
        reset: windowStart + (window_seconds || 60)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
