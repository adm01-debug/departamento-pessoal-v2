// V17-S042: REINFService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const reinfServiceReal = {
  async getEventos(empresaId: string, competencia?: string) { let q = supabase.from('reinf_eventos').select('*').eq('empresa_id', empresaId); if (competencia) q = q.eq('competencia', competencia); const { data, error } = await q; if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async criarEvento(empresaId: string, tipoEvento: string, dados: any) { const { data, error } = await supabase.from('reinf_eventos').insert({ empresa_id: empresaId, tipo_evento: tipoEvento, dados, status: 'pendente' }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; }
};
export default reinfServiceReal;
