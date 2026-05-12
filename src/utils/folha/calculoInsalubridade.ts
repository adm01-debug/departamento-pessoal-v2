import { calcularInsalubridade as calcBase } from '@/calculators/beneficios';
import { GrauInsalubridade } from '@/calculators/beneficios';

/**
 * Cálculo de adicional de insalubridade.
 * Baseado no salário mínimo nacional (padrão CLT).
 */
export const calcularInsalubridade = (grau: GrauInsalubridade) => {
  return calcBase(grau);
};

export default calcularInsalubridade;
