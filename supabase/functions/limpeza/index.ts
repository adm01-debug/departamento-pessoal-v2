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

    const results: Record<string, number> = {};

    // Cleanup expired blocked IPs
    const { data: ips } = await supabase
      .from('blocked_ips')
      .delete()
      .eq('permanent', false)
      .lt('expires_at', new Date().toISOString())
      .select('id');
    results.blocked_ips_cleaned = ips?.length || 0;

    // Cleanup old rate limit logs (>7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: rateLogs } = await supabase
      .from('rate_limit_logs')
      .delete()
      .lt('created_at', weekAgo.toISOString())
      .select('id');
    results.rate_limit_logs_cleaned = rateLogs?.length || 0;

    // Cleanup old login attempts (>30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const { data: loginAttempts } = await supabase
      .from('login_attempts')
      .delete()
      .lt('created_at', monthAgo.toISOString())
      .select('id');
    results.login_attempts_cleaned = loginAttempts?.length || 0;

    // Cleanup expired verification tokens
    const { data: tokens } = await supabase
      .from('verification_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');
    results.expired_tokens_cleaned = tokens?.length || 0;

    // Cleanup expired sessions
    const { data: sessions } = await supabase
      .from('user_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');
    results.expired_sessions_cleaned = sessions?.length || 0;

    const totalCleaned = Object.values(results).reduce((a, b) => a + b, 0);

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      results,
      total_cleaned: totalCleaned,
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
