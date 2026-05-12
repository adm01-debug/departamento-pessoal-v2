import { calcularDiarias } from '@/calculators/beneficios';

export const calculoDiarias = (valorDiaria: number, dias: number, percentualDesconto: number = 0) => {
  return calcularDiarias(valorDiaria, dias, percentualDesconto);
};
