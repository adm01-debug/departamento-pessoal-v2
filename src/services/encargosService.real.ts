// V17-S034: EncargosService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const ENCARGOS_PADRAO = { inss_patronal: 20, rat: 2, terceiros: 5.8, fgts: 8 };
export const encargosServiceReal = {
  calcular(baseCalculo: number, config = ENCARGOS_PADRAO) { return { inss_patronal: Math.round(baseCalculo * (config.inss_patronal / 100) * 100) / 100, rat: Math.round(baseCalculo * (config.rat / 100) * 100) / 100, terceiros: Math.round(baseCalculo * (config.terceiros / 100) * 100) / 100, fgts: Math.round(baseCalculo * (config.fgts / 100) * 100) / 100, total: Math.round(baseCalculo * ((config.inss_patronal + config.rat + config.terceiros + config.fgts) / 100) * 100) / 100 }; },
  async getByCompetencia(empresaId: string, competencia: string) { const { data, error } = await supabase.from('encargos').select('*').eq('empresa_id', empresaId).eq('competencia', competencia); if (error) throw new Error(handleSupabaseError(error)); return data || []; }
};
export default encargosServiceReal;
