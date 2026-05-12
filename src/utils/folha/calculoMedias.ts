import { calcularMedias as calcBase } from '@/calculators/beneficios';

/**
 * Cálculo de médias para verbas rescisórias, férias e 13º.
 * Geralmente baseado na média aritmética dos últimos 12 meses.
 */
export const calcularMediasSalarial = (valores: number[]) => {
  return calcBase(valores);
};

export default calcularMediasSalarial;
