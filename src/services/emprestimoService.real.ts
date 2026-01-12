// V17-S029: EmprestimoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const emprestimoServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data, error } = await supabase.from('emprestimos').select('*').eq('colaborador_id', colaboradorId).eq('status', 'ativo'); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async criar(colaboradorId: string, valorTotal: number, parcelas: number, parcelaValor: number) { const { data, error } = await supabase.from('emprestimos').insert({ colaborador_id: colaboradorId, valor_total: valorTotal, parcelas_total: parcelas, parcela_valor: parcelaValor, parcelas_pagas: 0, status: 'ativo' }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async registrarParcela(emprestimoId: string) { const { data: emp } = await supabase.from('emprestimos').select('*').eq('id', emprestimoId).single(); if (!emp) return; const novasPagas = emp.parcelas_pagas + 1; const status = novasPagas >= emp.parcelas_total ? 'quitado' : 'ativo'; await supabase.from('emprestimos').update({ parcelas_pagas: novasPagas, status }).eq('id', emprestimoId); }
};
export default emprestimoServiceReal;
