import { calcularQuilometragem } from '@/calculators/beneficios';

export const calculoQuilometragem = (km: number, valorPorKm: number = 1.20) => {
  return calcularQuilometragem(km, valorPorKm);
};
