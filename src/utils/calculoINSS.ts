export const FAIXAS_INSS_2024 = [
  { ate: 1412.00, aliquota: 0.075 },
  { ate: 2666.68, aliquota: 0.09 },
  { ate: 4000.03, aliquota: 0.12 },
  { ate: 7786.02, aliquota: 0.14 },
];
export const TETO_INSS_2024 = 7786.02;
export function calcularINSS(salarioBruto: number): number {
  let inss = 0;
  let salarioRestante = Math.min(salarioBruto, TETO_INSS_2024);
  let faixaAnterior = 0;
  for (const faixa of FAIXAS_INSS_2024) {
    if (salarioRestante <= 0) break;
    const baseCalculo = Math.min(salarioRestante, faixa.ate - faixaAnterior);
    inss += baseCalculo * faixa.aliquota;
    salarioRestante -= baseCalculo;
    faixaAnterior = faixa.ate;
  }
  return Math.round(inss * 100) / 100;
}
export function getAliquotaEfetiva(salarioBruto: number): number {
  const inss = calcularINSS(salarioBruto);
  return salarioBruto > 0 ? (inss / salarioBruto) * 100 : 0;
}
export default { calcularINSS, getAliquotaEfetiva, FAIXAS_INSS_2024, TETO_INSS_2024 };
