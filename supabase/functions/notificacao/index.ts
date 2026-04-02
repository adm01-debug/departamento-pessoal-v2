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
    const { action, empresaId, tipo, destinatarios, assunto, conteudo } = await req.json();

    switch (action) {
      case 'enviar': {
        for (const dest of (destinatarios || [])) {
          await supabase.from('notificacoes').insert({
            user_id: dest.user_id || null, empresa_id: empresaId || null,
            tipo: tipo || 'info', titulo: assunto || 'Notificação',
            mensagem: conteudo || '', lida: false,
          });
        }
        return new Response(JSON.stringify({ success: true, enviadas: destinatarios?.length || 0 }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      case 'listar': {
        let q = supabase.from('notificacoes').select('*').order('created_at', { ascending: false }).limit(50);
        if (empresaId) q = q.eq('empresa_id', empresaId);
        const { data, error } = await q;
        if (error) throw error;
        return new Response(JSON.stringify({ notificacoes: data }), {
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
