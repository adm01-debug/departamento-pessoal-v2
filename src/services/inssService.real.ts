// V17-S022: INSSService Real
import { calcularINSS } from '@/calculators/inss';
export const TETO_INSS_2025 = 8157.41;
export const TABELA_INSS_2025 = [
  { ate: 1518.00, aliquota: 7.5 },
  { ate: 2793.88, aliquota: 9 },
  { ate: 4190.83, aliquota: 12 },
  { ate: 8157.41, aliquota: 14 }
];
export const inssServiceReal = {
  calcular(salario: number) { return calcularINSS(salario); },
  getTabela() { return TABELA_INSS_2025; },
  getTeto() { return TETO_INSS_2025; },
  calcularPatronal(salario: number) { return Math.round(salario * 0.20 * 100) / 100; }
};
export default inssServiceReal;
