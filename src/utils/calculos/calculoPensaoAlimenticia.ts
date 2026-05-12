import { calcularPensaoAlimenticia } from '@/calculators/beneficios';

export const calculoPensaoAlimenticia = (salarioLiquido: number, percentual: number) => {
  return calcularPensaoAlimenticia(salarioLiquido, percentual);
};
