// V17-S028: PensaoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { calcularPensaoAlimenticia } from '@/calculators/pensaoAlimenticia';
export const pensaoServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data, error } = await supabase.from('pensoes').select('*').eq('colaborador_id', colaboradorId).eq('ativa', true); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async criar(colaboradorId: string, percentual: number, beneficiario: string) { const { data, error } = await supabase.from('pensoes').insert({ colaborador_id: colaboradorId, percentual, beneficiario, ativa: true }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async calcularDesconto(colaboradorId: string, salarioLiquido: number) { const pensoes = await this.getByColaborador(colaboradorId); let total = 0; pensoes.forEach(p => { total += calcularPensaoAlimenticia({ salarioLiquido, percentual: p.percentual }).valorTotal; }); return total; }
};
export default pensaoServiceReal;
