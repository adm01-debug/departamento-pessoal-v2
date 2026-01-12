// V17-S033: ProvisoesService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { calcularProvisoes } from '@/calculators/provisoes';
export const provisoesServiceReal = {
  async calcularMensal(empresaId: string, competencia: string) { const { data: cols } = await supabase.from('colaboradores').select('id, salario').eq('empresa_id', empresaId).eq('status', 'ativo'); const resultados = (cols || []).map(c => ({ colaborador_id: c.id, ...calcularProvisoes({ salarioBruto: c.salario }) })); const total = resultados.reduce((acc, r) => acc + r.totalMensal, 0); return { competencia, colaboradores: resultados, total: Math.round(total * 100) / 100 }; },
  async salvar(empresaId: string, competencia: string, valores: any) { const { data, error } = await supabase.from('provisoes').upsert({ empresa_id: empresaId, competencia, ...valores }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; }
};
export default provisoesServiceReal;
