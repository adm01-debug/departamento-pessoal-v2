import { calcularFerias } from '@/calculators/beneficios';

/**
 * Utilitário para cálculo de férias de acordo com a legislação brasileira (CLT).
 * 
 * @param salarioBase - Salário nominal do colaborador
 * @param diasGozo - Quantidade de dias de férias a serem gozados (padrão 30)
 * @param abonoPecuniario - Se haverá venda de 10 dias (opcional)
 * @param adiantamento13 - Se haverá adiantamento da primeira parcela do 13º (opcional)
 * @returns Objeto contendo valores detalhados de férias, 1/3 constitucional e deduções
 */
export const calcularFeriasTrabalhistas = (
  salarioBase: number,
  diasGozo: number = 30,
  abonoPecuniario: boolean = false,
  adiantamento13: boolean = false
) => {
  return calcularFerias(salarioBase, diasGozo, abonoPecuniario, adiantamento13);
};

export default calcularFeriasTrabalhistas;
