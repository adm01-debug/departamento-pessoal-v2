import { calcularAdicionalTransferencia } from '@/calculators/beneficios';

export const calculoTransferencia = (salarioBase: number, percentual: number = 25) => {
  return calcularAdicionalTransferencia(salarioBase, percentual);
};
