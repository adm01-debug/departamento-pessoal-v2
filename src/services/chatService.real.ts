// V17-S077: ChatService Real
import { supabase } from '@/integrations/supabase/client';
export const chatServiceReal = {
  async getConversas(usuarioId: string) { const { data } = await supabase.from('chat_conversas').select('*').or(`usuario1_id.eq.${usuarioId},usuario2_id.eq.${usuarioId}`); return data || []; },
  async getMensagens(conversaId: string) { const { data } = await supabase.from('chat_mensagens').select('*').eq('conversa_id', conversaId).order('created_at'); return data || []; },
  async enviarMensagem(conversaId: string, remetenteId: string, mensagem: string) { const { data } = await supabase.from('chat_mensagens').insert({ conversa_id: conversaId, remetente_id: remetenteId, mensagem }).select().single(); return data; }
}; export default chatServiceReal;
