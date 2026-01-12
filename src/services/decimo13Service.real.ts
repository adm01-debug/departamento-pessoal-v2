// V17-S025: Decimo13Service Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { calcular13Proporcional, calcular13Integral } from '@/calculators/decimo13';
export const decimo13ServiceReal = {
  async calcularPrimeiraParcela(empresaId: string, ano: number) { const { data: cols } = await supabase.from('colaboradores').select('id, nome, salario, data_admissao').eq('empresa_id', empresaId).eq('status', 'ativo'); const resultados = (cols || []).map(c => { const meses = Math.min(12, 12 - new Date(c.data_admissao).getMonth()); const calc = calcular13Proporcional({ salarioBase: c.salario, mesesTrabalhados: meses }); return { colaborador_id: c.id, nome: c.nome, valor: calc.primeiraParcela }; }); return resultados; },
  async calcularSegundaParcela(empresaId: string, ano: number) { const { data: cols } = await supabase.from('colaboradores').select('id, nome, salario, data_admissao').eq('empresa_id', empresaId).eq('status', 'ativo'); const resultados = (cols || []).map(c => { const meses = Math.min(12, 12 - new Date(c.data_admissao).getMonth()); const calc = calcular13Proporcional({ salarioBase: c.salario, mesesTrabalhados: meses }); return { colaborador_id: c.id, nome: c.nome, valor: calc.segundaParcela, inss: calc.inss, irrf: calc.irrf }; }); return resultados; }
};
export default decimo13ServiceReal;
