import { calcularSobreaviso } from '@/calculators/beneficios';

export const calculoSobreaviso = (salarioBase: number, horas: number) => {
  return calcularSobreaviso(salarioBase, horas);
};
