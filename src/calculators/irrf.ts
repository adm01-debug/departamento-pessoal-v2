// V15-305
import { TABELA_IRRF_2024, DEDUCAO_DEPENDENTE_IRRF } from '@/constants';
export function calcularIRRF(baseCalculo: number, dependentes: number = 0): number {
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE_IRRF;
  const base = baseCalculo - deducaoDependentes;
  for (const faixa of TABELA_IRRF_2024) {
    if (base >= faixa.min && base <= faixa.max) {
      return Math.max(0, base * (faixa.aliquota / 100) - faixa.deducao);
    }
  }
  return 0;
}
export function calcularBaseIRRF(salarioBruto: number, inss: number, pensaoAlimenticia: number = 0): number {
  return salarioBruto - inss - pensaoAlimenticia;
}
