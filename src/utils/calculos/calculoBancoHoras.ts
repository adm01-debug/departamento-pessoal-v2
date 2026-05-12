import { calcularBancoHoras } from '@/calculators/beneficios';

export const calculoBancoHoras = (creditos: string[], debitos: string[]) => {
  return calcularBancoHoras(creditos, debitos);
};
