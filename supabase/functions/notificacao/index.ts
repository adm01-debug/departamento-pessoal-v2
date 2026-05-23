import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateRequest, corsHeaders, createErrorResponse } from '../_shared/contract.ts';
import { notificacaoSchema } from '../_shared/schemas/common.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { data, errorResponse } = await validateRequest(req, notificacaoSchema);
  if (errorResponse) return errorResponse;

  const { action, empresaId, tipo, destinatarios, assunto, conteudo } = data!;

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

    switch (action) {
      case 'enviar': {
        if (!destinatarios || destinatarios.length === 0) {
          return createErrorResponse('Destinatários são obrigatórios para enviar notificações', 422, 'VALIDATION_ERROR');
        }
        for (const dest of destinatarios) {
          // 1. In-app notification
          const { data: notif, error: notifErr } = await supabase.from('notificacoes').insert({
            user_id: dest.user_id || null, empresa_id: empresaId || null,
            tipo: tipo || 'info', titulo: assunto || 'Notificação',
            mensagem: conteudo || '', lida: false,
          }).select().single();

          if (!notifErr && notif) {
            // 2. Queue for real delivery (Email/Push Engine)
            await supabase.from('fila_notificacoes').insert([
              { 
                user_id: dest.user_id, 
                tipo: 'email', 
                titulo: assunto, 
                conteudo: conteudo,
                metadados: { notification_id: notif.id } 
              },
              { 
                user_id: dest.user_id, 
                tipo: 'push', 
                titulo: assunto, 
                conteudo: conteudo,
                metadados: { notification_id: notif.id } 
              }
            ]);
          }
        }
        return new Response(JSON.stringify({ success: true, enviadas: destinatarios.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      case 'listar': {
        let q = supabase.from('notificacoes').select('*').order('created_at', { ascending: false }).limit(50);
        if (empresaId) q = q.eq('empresa_id', empresaId);
        const { data: list, error } = await q;
        if (error) throw error;
        return new Response(JSON.stringify({ notificacoes: list }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      default:
        return createErrorResponse('Ação inválida', 400, 'INVALID_ACTION');
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(message, 500, 'INTERNAL_SERVER_ERROR');
  }
});
