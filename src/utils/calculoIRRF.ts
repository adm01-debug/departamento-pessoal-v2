export const FAIXAS_IRRF_2024 = [
  { ate: 2259.20, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { ate: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { ate: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { ate: Infinity, aliquota: 0.275, deducao: 896.00 },
];
export const DEDUCAO_DEPENDENTE = 189.59;
export function calcularIRRF(baseCalculo: number, dependentes = 0): number {
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE;
  const baseAjustada = Math.max(0, baseCalculo - deducaoDependentes);
  for (const faixa of FAIXAS_IRRF_2024) {
    if (baseAjustada <= faixa.ate) {
      const irrf = baseAjustada * faixa.aliquota - faixa.deducao;
      return Math.max(0, Math.round(irrf * 100) / 100);
    }
  }
  return 0;
}
export function getAliquotaEfetiva(baseCalculo: number, dependentes = 0): number {
  const irrf = calcularIRRF(baseCalculo, dependentes);
  return baseCalculo > 0 ? (irrf / baseCalculo) * 100 : 0;
}
export default { calcularIRRF, getAliquotaEfetiva, FAIXAS_IRRF_2024, DEDUCAO_DEPENDENTE };
