// V17-S004: RescisaoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { calcular13Proporcional } from '@/calculators/decimo13';
import { calcularFeriasProporcional } from '@/calculators/ferias';
import { calcularAvisoPrevio } from '@/calculators/avisoPrevio';
import { calcularMultaFGTS } from '@/calculators/multaFGTS';

export interface Rescisao {
  id: string; demissao_id: string; saldo_salario: number; decimo13_proporcional: number;
  ferias_proporcionais: number; ferias_vencidas: number; aviso_previo: number;
  multa_fgts: number; total_bruto: number; total_descontos: number; total_liquido: number;
}

export const rescisaoServiceReal = {
  async calcular(demissaoId: string) {
    const { data: demissao } = await supabase.from('demissoes').select('*, colaborador:colaboradores(*)').eq('id', demissaoId).single();
    if (!demissao) throw new Error('Demissão não encontrada');
    const col = demissao.colaborador;
    const dataAdm = new Date(col.data_admissao);
    const dataDem = new Date(demissao.data_demissao);
    const diasTrab = dataDem.getDate();
    const mesesAno = dataDem.getMonth() + 1;
    const anosServico = (dataDem.getTime() - dataAdm.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const saldoSalario = Math.round((col.salario / 30) * diasTrab * 100) / 100;
    const d13 = calcular13Proporcional({ salarioBase: col.salario, mesesTrabalhados: mesesAno });
    const ferias = calcularFeriasProporcional(col.salario, mesesAno);
    const aviso = calcularAvisoPrevio({ tipoAviso: demissao.aviso_trabalhado ? 'trabalhado' : 'indenizado', anosServico, salario: col.salario });
    const fgts = calcularMultaFGTS({ saldoFGTS: col.salario * 0.08 * Math.floor(anosServico * 12), tipoRescisao: demissao.tipo });
    const totalBruto = saldoSalario + d13.bruto + ferias.total + aviso.valorIndenizado + fgts.valorMulta;
    const totalDescontos = d13.inss + d13.irrf;
    return { saldo_salario: saldoSalario, decimo13_proporcional: d13.bruto, ferias_proporcionais: ferias.proporcional, ferias_vencidas: 0, aviso_previo: aviso.valorIndenizado, multa_fgts: fgts.valorMulta, total_bruto: totalBruto, total_descontos: totalDescontos, total_liquido: totalBruto - totalDescontos };
  },
  async salvar(demissaoId: string, rescisao: Partial<Rescisao>) {
    const { data, error } = await supabase.from('rescisoes').upsert({ ...rescisao, demissao_id: demissaoId }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  }
};
export default rescisaoServiceReal;
