// V17-S024: FGTSDigitalService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const PERCENTUAL_FGTS = 8;
export const fgtsDigitalServiceReal = {
  calcular(salario: number) { return Math.round(salario * (PERCENTUAL_FGTS / 100) * 100) / 100; },
  async getDepositosMes(empresaId: string, competencia: string) { const { data, error } = await supabase.from('depositos_fgts').select('*').eq('empresa_id', empresaId).eq('competencia', competencia); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async registrarDeposito(empresaId: string, colaboradorId: string, competencia: string, valor: number) { const { data, error } = await supabase.from('depositos_fgts').insert({ empresa_id: empresaId, colaborador_id: colaboradorId, competencia, valor, data_deposito: new Date().toISOString() }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async getSaldoColaborador(colaboradorId: string) { const { data, error } = await supabase.from('depositos_fgts').select('valor').eq('colaborador_id', colaboradorId); if (error) throw new Error(handleSupabaseError(error)); return (data || []).reduce((acc, d) => acc + d.valor, 0); }
};
export default fgtsDigitalServiceReal;
