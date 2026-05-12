import { calcularSalarioLiquido as calcBase } from '@/calculators/folhaCompleta';

/**
 * Cálculo do salário líquido após todos os descontos legais e facultativos.
 */
export const calcularSalarioLiquido = (salarioBruto: number, dependentes: number = 0, outrasDeducoes: number = 0, valeTransporte: number = 0) => {
  return calcBase({ salarioBruto, dependentes, outrasDeducoes, valeTransporte });
};

export default calcularSalarioLiquido;
