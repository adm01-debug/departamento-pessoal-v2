// V17-S075: NotificacaoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const notificacaoServiceReal = {
  async getByUsuario(usuarioId: string) { const { data, error } = await supabase.from('notificacoes').select('*').eq('usuario_id', usuarioId).order('created_at', { ascending: false }); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async criar(usuarioId: string, titulo: string, mensagem: string, tipo?: string) { const { data, error } = await supabase.from('notificacoes').insert({ usuario_id: usuarioId, titulo, mensagem, tipo, lida: false }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async marcarLida(id: string) { await supabase.from('notificacoes').update({ lida: true }).eq('id', id); },
  async marcarTodasLidas(usuarioId: string) { await supabase.from('notificacoes').update({ lida: true }).eq('usuario_id', usuarioId); },
  async getNaoLidas(usuarioId: string) { const { data } = await supabase.from('notificacoes').select('*').eq('usuario_id', usuarioId).eq('lida', false); return data || []; }
}; export default notificacaoServiceReal;
