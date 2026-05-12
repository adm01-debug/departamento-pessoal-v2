import { calcularLiquido as calcBase } from '@/calculators/beneficios';

/**
 * Cálculo genérico de valor líquido (Bruto - Descontos).
 */
export const calcularValorLiquidoGenerico = (bruto: number, descontos: number) => {
  return calcBase(bruto, descontos);
};

export default calcularValorLiquidoGenerico;
