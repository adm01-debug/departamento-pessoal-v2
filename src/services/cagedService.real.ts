// V17-S038: CAGEDService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const cagedServiceReal = {
  async gerar(empresaId: string, competencia: string) { const [ano, mes] = competencia.split('-'); const { data: admissoes } = await supabase.from('colaboradores').select('*').eq('empresa_id', empresaId).gte('data_admissao', `${competencia}-01`).lte('data_admissao', `${competencia}-31`); const { data: demissoes } = await supabase.from('colaboradores').select('*').eq('empresa_id', empresaId).gte('data_demissao', `${competencia}-01`).lte('data_demissao', `${competencia}-31`); return { competencia, admissoes: admissoes?.length || 0, demissoes: demissoes?.length || 0 }; }
};
export default cagedServiceReal;
