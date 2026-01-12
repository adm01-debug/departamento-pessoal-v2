// V17-S084: AvaliacaoService Real
import { supabase } from '@/integrations/supabase/client';
export const avaliacaoServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data } = await supabase.from('avaliacoes').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false }); return data || []; },
  async criar(colaboradorId: string, avaliadorId: string, periodo: string, nota: number, comentarios?: string) { const { data } = await supabase.from('avaliacoes').insert({ colaborador_id: colaboradorId, avaliador_id: avaliadorId, periodo, nota, comentarios, data: new Date().toISOString() }).select().single(); return data; }
}; export default avaliacaoServiceReal;
