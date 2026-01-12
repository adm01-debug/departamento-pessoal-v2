// V17-S009: HorasExtrasService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { calcularHoraExtra } from '@/calculators/horasExtras';

export interface HoraExtra {
  id: string; colaborador_id: string; data: string; minutos: number;
  percentual: number; motivo?: string; aprovada: boolean; aprovado_por?: string;
  created_at: string;
}

export const horasExtrasServiceReal = {
  async getByColaborador(colaboradorId: string, mes?: string) {
    let query = supabase.from('horas_extras').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false });
    if (mes) { query = query.gte('data', `${mes}-01`).lte('data', `${mes}-31`); }
    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async registrar(he: Partial<HoraExtra>) {
    const { data, error } = await supabase.from('horas_extras').insert({ ...he, aprovada: false }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async aprovar(id: string, aprovadoPor: string) {
    const { data, error } = await supabase.from('horas_extras').update({ aprovada: true, aprovado_por: aprovadoPor }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async rejeitar(id: string, motivo: string) {
    const { error } = await supabase.from('horas_extras').delete().eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
  async calcularValor(colaboradorId: string, mes: string) {
    const { data: col } = await supabase.from('colaboradores').select('salario').eq('id', colaboradorId).single();
    if (!col) return 0;
    const hes = await this.getByColaborador(colaboradorId, mes);
    const aprovadas = hes.filter(h => h.aprovada);
    let total = 0;
    aprovadas.forEach(h => { total += calcularHoraExtra(col.salario, h.minutos / 60, h.percentual).valor; });
    return Math.round(total * 100) / 100;
  },
  async getPendentesAprovacao(empresaId: string) {
    const { data, error } = await supabase.from('horas_extras').select('*, colaborador:colaboradores!inner(id, nome, empresa_id)').eq('aprovada', false).eq('colaborador.empresa_id', empresaId);
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  }
};
export default horasExtrasServiceReal;
