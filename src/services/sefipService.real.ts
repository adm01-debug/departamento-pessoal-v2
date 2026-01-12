// V17-S037: SefipService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const sefipServiceReal = {
  async gerar(empresaId: string, competencia: string) { const { data: cols } = await supabase.from('colaboradores').select('*').eq('empresa_id', empresaId).eq('status', 'ativo'); return { competencia, totalTrabalhadores: cols?.length || 0, arquivo: `SEFIP_${competencia}.re` }; },
  async getHistorico(empresaId: string) { const { data, error } = await supabase.from('sefip_historico').select('*').eq('empresa_id', empresaId).order('competencia', { ascending: false }); if (error) throw new Error(handleSupabaseError(error)); return data || []; }
};
export default sefipServiceReal;
