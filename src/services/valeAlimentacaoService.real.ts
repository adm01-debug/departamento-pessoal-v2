// V17-S031: ValeAlimentacaoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const valeAlimentacaoServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data, error } = await supabase.from('vales_alimentacao').select('*').eq('colaborador_id', colaboradorId); if (error) throw new Error(handleSupabaseError(error)); return data?.[0] || null; },
  async configurar(colaboradorId: string, valorDia: number, diasUteis: number, tipo: 'VA' | 'VR') { const { data, error } = await supabase.from('vales_alimentacao').upsert({ colaborador_id: colaboradorId, valor_dia: valorDia, dias_uteis: diasUteis, tipo }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async calcularMensal(colaboradorId: string) { const config = await this.getByColaborador(colaboradorId); if (!config) return 0; return Math.round(config.valor_dia * config.dias_uteis * 100) / 100; }
};
export default valeAlimentacaoServiceReal;
