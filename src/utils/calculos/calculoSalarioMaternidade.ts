import { calcularSalarioMaternidade } from '@/calculators/beneficios';

export const calculoSalarioMaternidade = (salarioBase: number, diasLicenca: number = 120) => {
  return calcularSalarioMaternidade(salarioBase, diasLicenca);
};
