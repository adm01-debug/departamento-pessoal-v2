import { calcularPLR as calcBase } from '@/calculators/rescisao';

/**
 * Cálculo de Participação nos Lucros e Resultados (PLR).
 * Tributação exclusiva na fonte com tabela própria.
 */
export const calcularPLRColaborador = (valorPLR: number) => {
  return calcBase(valorPLR);
};

export default calcularPLRColaborador;
