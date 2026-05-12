import { calcularDescontoVT } from '@/calculators/beneficios';

export const calculoValeTransporte = (salarioBase: number, valorVT: number) => {
  return calcularDescontoVT(salarioBase, valorVT);
};
