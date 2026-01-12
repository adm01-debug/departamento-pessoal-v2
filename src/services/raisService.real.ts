// V17-S039: RAISService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const raisServiceReal = {
  async gerar(empresaId: string, anoBase: number) { const { data: cols } = await supabase.from('colaboradores').select('*').eq('empresa_id', empresaId); const ativos = cols?.filter(c => c.status === 'ativo' || (c.data_demissao && c.data_demissao.startsWith(String(anoBase)))); return { anoBase, totalTrabalhadores: ativos?.length || 0 }; }
};
export default raisServiceReal;
