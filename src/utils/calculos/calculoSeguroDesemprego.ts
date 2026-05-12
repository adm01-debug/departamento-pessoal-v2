import { calcularSeguroDesemprego } from '@/calculators/rescisao';

export const calculoSeguroDesemprego = (ultimosSalarios: number[]) => {
  return calcularSeguroDesemprego(ultimosSalarios);
};
