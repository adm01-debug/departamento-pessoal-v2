import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';
import { captureException } from '../_shared/sentry.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
};

const GOVBR_AUTH_URL = 'https://sso.staging.acesso.gov.br/authorize';
const GOVBR_TOKEN_URL = 'https://sso.staging.acesso.gov.br/token';
const GOVBR_USERINFO_URL = 'https://sso.staging.acesso.gov.br/userinfo';

const BodySchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('get_auth_url'),
    redirectUri: z.string().url().max(512),
  }),
  z.object({
    action: z.literal('callback'),
    code: z.string().min(1).max(2048),
    state: z.string().uuid(),
    redirectUri: z.string().url().max(512).optional(),
  }),
]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== 'POST') return json({ success: false, error: 'Method not allowed' }, 405);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    // JWT auth required for both actions
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return json({ success: false, error: 'Autenticação obrigatória' }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return json({ success: false, error: 'Sessão inválida' }, 401);
    }
    const userId = userData.user.id;

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Rate limit: 5 auth attempts per minute per user
    const { checkRateLimit, rateLimitResponse } = await import('../_shared/rateLimit.ts');
    const rl = await checkRateLimit(supabase, { key: `govbr:${userId}`, limit: 5, windowSec: 60 });
    if (!rl.allowed) return rateLimitResponse(rl);

    let raw: unknown;
    try { raw = await req.json(); } catch { return json({ success: false, error: 'JSON inválido' }, 400); }
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return json({ success: false, error: 'Payload inválido' }, 422);
    }
    const body = parsed.data;

    if (body.action === 'get_auth_url') {
      const clientId = Deno.env.get('GOVBR_CLIENT_ID');
      if (!clientId) {
        return json({ success: false, error: 'Gov.br não configurado' }, 503);
      }

      const newState = crypto.randomUUID();
      const nonce = crypto.randomUUID();

      await supabase.from('govbr_auth_state').insert({
        state: newState,
        nonce,
        redirect_uri: body.redirectUri,
        user_id: userId,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10min TTL
      });

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: 'openid profile govbr_confiabilidades',
        redirect_uri: body.redirectUri,
        nonce,
        state: newState,
      });

      return json({ success: true, url: `${GOVBR_AUTH_URL}?${params.toString()}` });
    }

    if (body.action === 'callback') {
      const { data: authState } = await supabase
        .from('govbr_auth_state')
        .select('*')
        .eq('state', body.state)
        .eq('user_id', userId)
        .maybeSingle();

      if (!authState) {
        return json({ success: false, error: 'Estado de autenticação inválido ou expirado' }, 400);
      }

      // Check expiry
      if (authState.expires_at && new Date(authState.expires_at) < new Date()) {
        await supabase.from('govbr_auth_state').delete().eq('id', authState.id);
        return json({ success: false, error: 'Estado expirado' }, 400);
      }

      const clientId = Deno.env.get('GOVBR_CLIENT_ID') ?? '';
      const clientSecret = Deno.env.get('GOVBR_CLIENT_SECRET') ?? '';

      const tokenResponse = await fetch(GOVBR_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: body.code,
          redirect_uri: authState.redirect_uri,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!tokenResponse.ok) {
        return json({ success: false, error: 'Falha na troca de token com Gov.br' }, 502);
      }
      const tokens = await tokenResponse.json();

      const userResponse = await fetch(GOVBR_USERINFO_URL, {
        headers: { 'Authorization': `Bearer ${tokens.access_token}` },
      });

      if (!userResponse.ok) {
        return json({ success: false, error: 'Falha ao obter dados do Gov.br' }, 502);
      }
      const userInfo = await userResponse.json();

      await supabase.from('profiles').update({
        govbr_uid: userInfo.sub,
        govbr_nivel_autenticacao: userInfo.nivel || 'Bronze',
        cpf_validado_govbr: true,
        nome_completo: userInfo.name,
      }).eq('user_id', userId);

      await supabase.from('govbr_auth_state').delete().eq('id', authState.id);

      return json({ success: true, nivel: userInfo.nivel || 'Bronze' });
    }

    return json({ success: false, error: 'Ação inválida' }, 400);
  } catch (error: unknown) {
    try { captureException(error, { fn: 'auth-gov-br' }); } catch { /* noop */ }
    return json({ success: false, error: 'Erro interno' }, 500);
  }
});
