import { calcularAdicionalTransferencia as calcBase } from '@/calculators/beneficios';

/**
 * Adicional de transferência (mínimo 25%).
 */
export const calcularAdicionalTransferencia = (salarioBase: number, percentual: number = 25) => {
  return calcBase(salarioBase, percentual);
};

export default calcularAdicionalTransferencia;
