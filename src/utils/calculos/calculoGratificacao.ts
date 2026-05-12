import { calcularGratificacao } from '@/calculators/beneficios';

export const calculoGratificacao = (salarioBase: number, percentual: number) => {
  return calcularGratificacao(salarioBase, percentual);
};
