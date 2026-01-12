// V17-S023: IRRFService Real
import { calcularIRRF } from '@/calculators/irrf';
export const DEDUCAO_DEPENDENTE_2025 = 189.59;
export const TABELA_IRRF_2025 = [
  { ate: 2259.20, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 7.5, deducao: 169.44 },
  { ate: 3751.05, aliquota: 15, deducao: 381.44 },
  { ate: 4664.68, aliquota: 22.5, deducao: 662.77 },
  { ate: Infinity, aliquota: 27.5, deducao: 896.00 }
];
export const irrfServiceReal = {
  calcular(baseCalculo: number, dependentes: number = 0) { return calcularIRRF(baseCalculo, dependentes); },
  getTabela() { return TABELA_IRRF_2025; },
  getDeducaoDependente() { return DEDUCAO_DEPENDENTE_2025; }
};
export default irrfServiceReal;
