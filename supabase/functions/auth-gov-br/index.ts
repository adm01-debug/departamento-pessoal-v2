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

    // Passo 1: Gerar URL de Autenticação
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
        client_id: Deno.env.get('GOVBR_CLIENT_ID') || 'demo-client',
        scope: 'openid+profile+govbr_confiabilidades',
        redirect_uri: redirectUri,
        nonce: nonce,
        state: newState,
      });

      return new Response(JSON.stringify({ url: `${GOVBR_AUTH_URL}?${params.toString()}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Passo 2: Trocar código por token e obter dados do usuário
    if (action === 'callback') {
      const { data: authState, error: stateError } = await supabase
        .from('govbr_auth_state')
        .select('*')
        .eq('state', state)
        .maybeSingle();

      if (stateError || !authState) throw new Error('Estado de autenticação inválido ou expirado');

      // Simulação de troca de token (Handshake real requer Client Secret do Gov.br)
      // Em produção, aqui seria feito um fetch POST para GOVBR_TOKEN_URL
      const mockUserInfo = {
        sub: `govbr-${authState.nonce.slice(0, 8)}`,
        name: 'Usuário Gov.br Simulado',
        cpf: '000.000.000-00',
        nivel: 'Prata'
      };

      // Atualizar perfil ou criar vínculo
      const { data: user } = await supabase.auth.getUser(req.headers.get('Authorization')?.split(' ')[1] || '');
      
      if (user?.user) {
        await supabase.from('profiles').update({
          govbr_uid: mockUserInfo.sub,
          govbr_nivel_autenticacao: mockUserInfo.nivel,
          cpf_validado_govbr: true
        }).eq('user_id', user.user.id);
      }

      // Limpar state
      await supabase.from('govbr_auth_state').delete().eq('id', authState.id);

      return new Response(JSON.stringify({ success: true, profile: mockUserInfo }), {
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
