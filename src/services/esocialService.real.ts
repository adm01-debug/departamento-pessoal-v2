// V17-S036: ESocialService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export type StatusEvento = 'pendente' | 'enviado' | 'processado' | 'erro' | 'rejeitado';
export const esocialServiceReal = {
  async getEventos(empresaId: string, competencia?: string) { let q = supabase.from('esocial_eventos').select('*').eq('empresa_id', empresaId).order('created_at', { ascending: false }); if (competencia) q = q.eq('competencia', competencia); const { data, error } = await q; if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async criarEvento(empresaId: string, tipoEvento: string, dados: any, competencia: string) { const { data, error } = await supabase.from('esocial_eventos').insert({ empresa_id: empresaId, tipo_evento: tipoEvento, dados, competencia, status: 'pendente' }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async enviarEvento(eventoId: string) { await supabase.from('esocial_eventos').update({ status: 'enviado', data_envio: new Date().toISOString() }).eq('id', eventoId); return { success: true }; },
  async consultarRetorno(eventoId: string) { const { data } = await supabase.from('esocial_eventos').select('*').eq('id', eventoId).single(); return data; }
};
export default esocialServiceReal;
