import { calcularPLR } from '@/calculators/rescisao';

export const calculoPPR = (valor: number) => {
  // PPR segue regra similar ao PLR para fins de cálculo de IRRF específico
  return calcularPLR(valor);
};
