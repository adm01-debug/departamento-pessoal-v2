import { calcularSalarioLiquido } from '@/calculators/folhaCompleta';

export const calculoLiquido = (salarioBruto: number, descontos: number) => {
  return Math.round((salarioBruto - descontos) * 100) / 100;
};
