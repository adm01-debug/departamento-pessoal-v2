import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { action, empresaId, data } = await req.json();

    switch (action) {
      case 'registrar': {
        const { error } = await supabase.from('auditoria').insert({
          acao: data.acao, entidade: data.entidade, entidade_id: data.entidade_id,
          usuario_id: data.usuario_id, usuario_nome: data.usuario_nome, empresa_id: empresaId,
          descricao: data.descricao, dados_anteriores: data.dados_anteriores || null,
          dados_novos: data.dados_novos || null,
          ip_address: data.ip_address || req.headers.get('x-forwarded-for') || null,
        });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      case 'listar': {
        let q = supabase.from('auditoria').select('*').order('created_at', { ascending: false }).limit(100);
        if (empresaId) q = q.eq('empresa_id', empresaId);
        if (data?.entidade) q = q.eq('entidade', data.entidade);
        if (data?.data_inicio) q = q.gte('created_at', data.data_inicio);
        if (data?.data_fim) q = q.lte('created_at', data.data_fim);
        const { data: logs, error } = await q;
        if (error) throw error;
        return new Response(JSON.stringify({ logs }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      case 'resumo': {
        const { data: logs, error } = await supabase.from('auditoria').select('acao, entidade').eq('empresa_id', empresaId || '');
        if (error) throw error;
        const acoes: Record<string, number> = {};
        (logs || []).forEach((l: any) => { acoes[l.acao] = (acoes[l.acao] || 0) + 1; });
        return new Response(JSON.stringify({ total: logs?.length || 0, acoes }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      default:
        return new Response(JSON.stringify({ error: 'Ação inválida' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
        });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
