import { calcularInsalubridade, GrauInsalubridade } from '@/calculators/beneficios';

export const calculoInsalubridade = (grau: GrauInsalubridade) => {
  return calcularInsalubridade(grau);
};
