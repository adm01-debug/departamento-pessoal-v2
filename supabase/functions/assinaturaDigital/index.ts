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

    const { action, tokenId, admissaoId, assinaturaBase64, ipAddress } = await req.json();

    if (action === 'verificar') {
      // Verificar status de assinatura de um token
      const { data: token, error } = await supabase
        .from('admissao_tokens')
        .select('*, admissoes(nome, cargo, departamento)')
        .eq('id', tokenId)
        .single();
      if (error) throw error;

      const expirado = new Date(token.data_expiracao) < new Date();
      return new Response(JSON.stringify({
        success: true,
        data: {
          valido: !expirado && !token.contrato_assinado,
          expirado,
          assinado: token.contrato_assinado,
          admissao: token.admissoes,
        },
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } else if (action === 'assinar') {
      // Registrar assinatura digital
      if (!tokenId || !assinaturaBase64) {
        return new Response(JSON.stringify({ success: false, error: 'tokenId e assinaturaBase64 são obrigatórios' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
        });
      }

      // Verificar token válido
      const { data: token, error: fetchErr } = await supabase
        .from('admissao_tokens')
        .select('*')
        .eq('id', tokenId)
        .single();
      if (fetchErr) throw fetchErr;

      if (token.contrato_assinado) {
        return new Response(JSON.stringify({ success: false, error: 'Contrato já foi assinado' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
        });
      }
      if (new Date(token.data_expiracao) < new Date()) {
        return new Response(JSON.stringify({ success: false, error: 'Token expirado' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
        });
      }

      // Gerar hash da assinatura para integridade
      const encoder = new TextEncoder();
      const data = encoder.encode(assinaturaBase64 + token.token + new Date().toISOString());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Salvar assinatura
      const { error: updateErr } = await supabase
        .from('admissao_tokens')
        .update({
          contrato_assinado: true,
          assinado_em: new Date().toISOString(),
          assinatura_base64: assinaturaBase64,
          ip_assinatura: ipAddress || 'unknown',
        })
        .eq('id', tokenId);
      if (updateErr) throw updateErr;

      // Log de auditoria
      await supabase.from('audit_log').insert({
        tabela: 'admissao_tokens',
        registro_id: tokenId,
        acao: 'ASSINATURA_DIGITAL',
        dados_novos: { hash: hashHex, ip: ipAddress, timestamp: new Date().toISOString() },
      });

      return new Response(JSON.stringify({
        success: true,
        data: { hash: hashHex, assinado_em: new Date().toISOString() },
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } else if (action === 'listar') {
      // Listar todas as assinaturas pendentes/concluídas
      const { data: tokens, error } = await supabase
        .from('admissao_tokens')
        .select('id, token, contrato_assinado, assinado_em, data_expiracao, admissoes(nome, cargo)')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data: tokens }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Ação inválida. Use: verificar, assinar, listar' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
