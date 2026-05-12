import { calcularFerias } from '@/calculators/beneficios';

/**
 * Utilitário para cálculo de férias de acordo com a legislação brasileira (CLT).
 * 
 * @param salarioBase - Salário nominal do colaborador
 * @param diasGozo - Quantidade de dias de férias a serem gozados (padrão 30)
 * @param abonoPecuniario - Se haverá venda de 10 dias (opcional)
 * @param dependentes - Número de dependentes para IRRF
 * @returns Objeto contendo valores detalhados de férias, 1/3 constitucional e deduções
 */
export const calcularFeriasTrabalhistas = (
  salarioBase: number,
  diasGozo: number = 30,
  abonoPecuniario: boolean = false,
  dependentes: number = 0
) => {
  const diasAbono = abonoPecuniario ? 10 : 0;
  return calcularFerias(salarioBase, diasGozo, diasAbono, dependentes);
};

export default calcularFeriasTrabalhistas;
