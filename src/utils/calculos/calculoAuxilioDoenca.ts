import { calcularAuxilioDoenca } from '@/calculators/beneficios';

export const calculoAuxilioDoenca = (ultimosSalarios: number[]) => {
  const media = ultimosSalarios.length > 0 ? ultimosSalarios.reduce((a, b) => a + b, 0) / ultimosSalarios.length : 0;
  return calcularAuxilioDoenca(media);
};
