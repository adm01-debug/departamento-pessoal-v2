import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOVBR_AUTH_URL = 'https://sso.staging.acesso.gov.br/authorize';
const GOVBR_TOKEN_URL = 'https://sso.staging.acesso.gov.br/token';
const GOVBR_USERINFO_URL = 'https://sso.staging.acesso.gov.br/userinfo';

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { action, code, state, redirectUri } = await req.json();

    if (action === 'get_auth_url') {
      const newState = crypto.randomUUID();
      const nonce = crypto.randomUUID();
      
      await supabase.from('govbr_auth_state').insert({
        state: newState,
        nonce,
        redirect_uri: redirectUri
      });

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: Deno.env.get('GOVBR_CLIENT_ID') || '',
        scope: 'openid profile govbr_confiabilidades',
        redirect_uri: redirectUri,
        nonce: nonce,
        state: newState,
      });

      return new Response(JSON.stringify({ url: `${GOVBR_AUTH_URL}?${params.toString()}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'callback') {
      const { data: authState } = await supabase
        .from('govbr_auth_state')
        .select('*')
        .eq('state', state)
        .maybeSingle();

      if (!authState) throw new Error('Estado de autenticação inválido ou expirado');

      // Troca real de código por token
      const tokenResponse = await fetch(GOVBR_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: authState.redirect_uri,
          client_id: Deno.env.get('GOVBR_CLIENT_ID')!,
          client_secret: Deno.env.get('GOVBR_CLIENT_SECRET')!,
        }),
      });

      if (!tokenResponse.ok) throw new Error('Falha na troca de token com Gov.br');
      const tokens = await tokenResponse.json();

      // Obter dados do usuário
      const userResponse = await fetch(GOVBR_USERINFO_URL, {
        headers: { 'Authorization': `Bearer ${tokens.access_token}` },
      });

      if (!userResponse.ok) throw new Error('Falha ao obter dados do usuário Gov.br');
      const userInfo = await userResponse.json();

      // Atualizar perfil
      const authHeader = req.headers.get('Authorization');
      const { data: user } = await supabase.auth.getUser(authHeader?.split(' ')[1] || '');
      
      if (user?.user) {
        await supabase.from('profiles').update({
          govbr_uid: userInfo.sub,
          govbr_nivel_autenticacao: userInfo.nivel || 'Bronze',
          cpf_validado_govbr: true,
          nome_completo: userInfo.name,
        }).eq('user_id', user.user.id);
      }

      await supabase.from('govbr_auth_state').delete().eq('id', authState.id);

      return new Response(JSON.stringify({ success: true, profile: userInfo }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Ação inválida');
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
