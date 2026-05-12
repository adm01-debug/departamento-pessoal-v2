import { calcularGratificacao as calcBase } from '@/calculators/beneficios';

/**
 * Cálculo de gratificações por função ou mérito.
 */
export const calcularGratificacaoSalarial = (salarioBase: number, percentual: number) => {
  return calcBase(salarioBase, percentual);
};

export default calcularGratificacaoSalarial;
