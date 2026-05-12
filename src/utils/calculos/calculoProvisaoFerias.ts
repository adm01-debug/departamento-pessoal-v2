import { calcularProvisaoFerias } from '@/calculators/rescisao';

export const calculoProvisaoFerias = (salarioBase: number, mesesAquisitivo: number) => {
  return calcularProvisaoFerias(salarioBase, mesesAquisitivo);
};
