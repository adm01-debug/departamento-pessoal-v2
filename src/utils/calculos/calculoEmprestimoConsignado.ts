import { calcularMargemConsignado } from '@/calculators/rescisao';

export const calculoEmprestimoConsignado = (salarioLiquido: number) => {
  return calcularMargemConsignado(salarioLiquido);
};
