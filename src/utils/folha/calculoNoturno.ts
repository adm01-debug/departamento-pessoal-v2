import { calcularAdicionalNoturno as calcBase } from '@/calculators/beneficios';

/**
 * Cálculo de adicional noturno.
 * Acréscimo de pelo menos 20% sobre a hora diurna para trabalho entre 22h e 5h.
 */
export const calcularAdicionalNoturno = (
  salarioBase: number, 
  horasNoturnas: number, 
  jornadaMensal: number = 220, 
  percentual: number = 20
) => {
  return calcBase(salarioBase, horasNoturnas, jornadaMensal, percentual);
};

export default calcularAdicionalNoturno;
