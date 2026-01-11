// V15-304
import { TABELA_INSS_2024 } from '@/constants';
export function calcularINSS(salarioBruto: number): number {
  let inss = 0, salarioRestante = salarioBruto;
  for (const faixa of TABELA_INSS_2024) {
    if (salarioBruto > faixa.min) {
      const base = Math.min(salarioBruto, faixa.max) - faixa.min;
      inss += base * (faixa.aliquota / 100);
    }
  }
  return Math.min(inss, 908.85);
}
export function calcularAliquotaEfetivaINSS(salarioBruto: number): number {
  const inss = calcularINSS(salarioBruto);
  return (inss / salarioBruto) * 100;
}
