import { calcularPericulosidade as calcBase } from '@/calculators/beneficios';

/**
 * Cálculo de adicional de periculosidade.
 * 30% sobre o salário base do colaborador.
 */
export const calcularPericulosidade = (salarioBase: number) => {
  return calcBase(salarioBase);
};

export default calcularPericulosidade;
