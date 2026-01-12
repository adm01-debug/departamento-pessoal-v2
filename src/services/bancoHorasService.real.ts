// V17-S008: BancoHorasService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { calcularSaldoBancoHoras, calcularValorPagamento } from '@/calculators/bancoHoras';

export interface MovimentacaoBH {
  id: string; colaborador_id: string; tipo: 'credito' | 'debito'; minutos: number;
  data: string; motivo?: string; aprovado: boolean; created_at: string;
}

export const bancoHorasServiceReal = {
  async getSaldo(colaboradorId: string) {
    const { data, error } = await supabase.from('banco_horas').select('*').eq('colaborador_id', colaboradorId).eq('aprovado', true);
    if (error) throw new Error(handleSupabaseError(error));
    return calcularSaldoBancoHoras((data || []).map(m => ({ tipo: m.tipo, minutos: m.minutos, data: m.data })));
  },
  async getExtrato(colaboradorId: string, dataInicio?: string, dataFim?: string) {
    let query = supabase.from('banco_horas').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false });
    if (dataInicio) query = query.gte('data', dataInicio);
    if (dataFim) query = query.lte('data', dataFim);
    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async registrar(colaboradorId: string, tipo: 'credito' | 'debito', minutos: number, motivo?: string) {
    const { data, error } = await supabase.from('banco_horas').insert({ colaborador_id: colaboradorId, tipo, minutos, data: new Date().toISOString().split('T')[0], motivo, aprovado: false }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async aprovar(id: string) {
    const { data, error } = await supabase.from('banco_horas').update({ aprovado: true }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async pagar(colaboradorId: string, minutos: number, valorHora: number) {
    const valor = calcularValorPagamento(minutos, valorHora);
    await this.registrar(colaboradorId, 'debito', minutos, 'Pagamento em dinheiro');
    return valor;
  }
};
export default bancoHorasServiceReal;
