// V17-S026: PLRService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { calcularPLR } from '@/calculators/plr';
export const plrServiceReal = {
  async calcular(empresaId: string, valorBase: number, ano: number) { const { data: cols } = await supabase.from('colaboradores').select('id, nome, data_admissao').eq('empresa_id', empresaId).eq('status', 'ativo'); const resultados = (cols || []).map(c => { const dataAdm = new Date(c.data_admissao); const meses = dataAdm.getFullYear() < ano ? 12 : 12 - dataAdm.getMonth(); const calc = calcularPLR({ valorBruto: valorBase, mesesTrabalhados: meses }); return { colaborador_id: c.id, nome: c.nome, ...calc }; }); return resultados; },
  async salvarPagamento(empresaId: string, ano: number, pagamentos: any[]) { const { error } = await supabase.from('pagamentos_plr').insert(pagamentos.map(p => ({ empresa_id: empresaId, ano, ...p }))); if (error) throw new Error(handleSupabaseError(error)); }
};
export default plrServiceReal;
