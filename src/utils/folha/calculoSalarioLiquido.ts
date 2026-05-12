import { calcularSalarioLiquido as calcBase } from '@/calculators/folhaCompleta';

/**
 * Cálculo do salário líquido após todos os descontos legais e facultativos.
 */
export const calcularSalarioLiquido = (salarioBruto: number, dependentes: number = 0, outrosDescontos: number = 0) => {
  return calcBase(salarioBruto, dependentes, outrosDescontos);
};

export default calcularSalarioLiquido;
