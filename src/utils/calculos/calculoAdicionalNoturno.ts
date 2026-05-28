import { calcularAdicionalNoturno } from '@/calculators/beneficios';

export const calculoAdicionalNoturno = (salarioBase: number, horasNoturnas: number, percentual: number = 20) => {
  return calcularAdicionalNoturno(salarioBase, horasNoturnas, 220, percentual);
};
