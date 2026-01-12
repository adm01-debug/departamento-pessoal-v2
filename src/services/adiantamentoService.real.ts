// V17-S027: AdiantamentoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const adiantamentoServiceReal = {
  async getByColaborador(colaboradorId: string, competencia?: string) { let query = supabase.from('adiantamentos').select('*').eq('colaborador_id', colaboradorId); if (competencia) query = query.eq('competencia', competencia); const { data, error } = await query.order('data', { ascending: false }); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async criar(colaboradorId: string, valor: number, competencia: string) { const { data, error } = await supabase.from('adiantamentos').insert({ colaborador_id: colaboradorId, valor, competencia, data: new Date().toISOString(), status: 'pendente' }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async aprovar(id: string) { const { data, error } = await supabase.from('adiantamentos').update({ status: 'aprovado' }).eq('id', id).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; }
};
export default adiantamentoServiceReal;
