/**
 * Cálculos relacionados ao Ponto Eletrônico (Horas Extras, DSR, Adicionais).
 */
import { calcularHorasExtras, calcularDSR } from '@/calculators/beneficios';

export const processarCalculosPonto = (
  salarioBase: number, 
  horasExtras50: number, 
  horasExtras100: number,
  diasUteis: number = 26,
  domingosEFeriados: number = 4
) => {
  return calcularHorasExtras(salarioBase, horasExtras50, horasExtras100, 220, diasUteis, domingosEFeriados);
};

export default processarCalculosPonto;
