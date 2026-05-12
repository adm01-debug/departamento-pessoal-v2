import { calcularComissao as calcBase } from '@/calculators/beneficios';

/**
 * Cálculo de comissões sobre vendas ou metas.
 */
export const calcularComissaoVendas = (valorBase: number, percentual: number) => {
  return calcBase(valorBase, percentual);
};

export default calcularComissaoVendas;
