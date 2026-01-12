// V17-S078: TicketService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const ticketServiceReal = {
  async getAll(empresaId: string) { const { data, error } = await supabase.from('tickets').select('*').eq('empresa_id', empresaId).order('created_at', { ascending: false }); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async criar(empresaId: string, usuarioId: string, titulo: string, descricao: string, prioridade: string) { const { data, error } = await supabase.from('tickets').insert({ empresa_id: empresaId, usuario_id: usuarioId, titulo, descricao, prioridade, status: 'aberto' }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async responder(ticketId: string, usuarioId: string, mensagem: string) { await supabase.from('ticket_respostas').insert({ ticket_id: ticketId, usuario_id: usuarioId, mensagem }); },
  async fechar(ticketId: string) { await supabase.from('tickets').update({ status: 'fechado' }).eq('id', ticketId); }
}; export default ticketServiceReal;
