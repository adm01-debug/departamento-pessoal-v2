import { calcularEmprestimoConsignado as calcBase } from '@/calculators/beneficios';

/**
 * Validação de margem consignável (limite de 35% do salário líquido).
 */
export const calcularEmprestimoConsignado = (salarioLiquido: number, parcela: number) => {
  return calcBase(salarioLiquido, parcela);
};

export default calcularEmprestimoConsignado;
