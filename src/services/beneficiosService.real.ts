// V17-S032: BeneficiosService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const beneficiosServiceReal = {
  async getAll(empresaId: string) { const { data, error } = await supabase.from('beneficios').select('*').eq('empresa_id', empresaId); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async getByColaborador(colaboradorId: string) { const { data, error } = await supabase.from('colaborador_beneficios').select('*, beneficio:beneficios(*)').eq('colaborador_id', colaboradorId); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async atribuir(colaboradorId: string, beneficioId: string, valorDesconto?: number) { const { data, error } = await supabase.from('colaborador_beneficios').insert({ colaborador_id: colaboradorId, beneficio_id: beneficioId, valor_desconto: valorDesconto }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async remover(colaboradorId: string, beneficioId: string) { const { error } = await supabase.from('colaborador_beneficios').delete().eq('colaborador_id', colaboradorId).eq('beneficio_id', beneficioId); if (error) throw new Error(handleSupabaseError(error)); }
};
export default beneficiosServiceReal;
