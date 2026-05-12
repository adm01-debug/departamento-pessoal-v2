import { calcularComissao } from '@/calculators/beneficios';

export const calculoComissao = (valorVendas: number, percentualComissao: number) => {
  return calcularComissao(valorVendas, percentualComissao);
};
