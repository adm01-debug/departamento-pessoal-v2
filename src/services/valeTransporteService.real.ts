// V17-S030: ValeTransporteService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { calcularValeTransporte } from '@/calculators/valeTransporte';
export const valeTransporteServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data, error } = await supabase.from('vales_transporte').select('*').eq('colaborador_id', colaboradorId); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async configurar(colaboradorId: string, valorPassagem: number, diasUteis: number) { const { data, error } = await supabase.from('vales_transporte').upsert({ colaborador_id: colaboradorId, valor_passagem: valorPassagem, dias_uteis: diasUteis }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async calcular(colaboradorId: string, salarioBase: number) { const config = await this.getByColaborador(colaboradorId); if (!config.length) return { valorVT: 0, descontoEmpregado: 0, custoEmpresa: 0, limiteDesconto: 0 }; return calcularValeTransporte({ salarioBase, valorPassagem: config[0].valor_passagem, diasUteis: config[0].dias_uteis }); }
};
export default valeTransporteServiceReal;
