// V17-S086: TreinamentoService Real
import { supabase } from '@/integrations/supabase/client';
export const treinamentoServiceReal = {
  async getAll(empresaId: string) { const { data } = await supabase.from('treinamentos').select('*').eq('empresa_id', empresaId).order('data', { ascending: false }); return data || []; },
  async criar(empresaId: string, nome: string, descricao: string, data: string, cargaHoraria: number) { const { data: t } = await supabase.from('treinamentos').insert({ empresa_id: empresaId, nome, descricao, data, carga_horaria: cargaHoraria }).select().single(); return t; },
  async inscrever(treinamentoId: string, colaboradorId: string) { await supabase.from('treinamento_participantes').insert({ treinamento_id: treinamentoId, colaborador_id: colaboradorId }); },
  async registrarPresenca(treinamentoId: string, colaboradorId: string, presente: boolean) { await supabase.from('treinamento_participantes').update({ presente }).eq('treinamento_id', treinamentoId).eq('colaborador_id', colaboradorId); }
}; export default treinamentoServiceReal;
