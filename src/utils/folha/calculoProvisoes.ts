import { calcularProvisaoFerias, calcularProvisao13 } from '@/calculators/rescisao';

/**
 * Cálculo de provisões mensais para Férias e 13º Salário.
 * Inclui os encargos sociais proporcionais.
 */
export const calcularProvisoesMensais = (salarioBase: number, mesesTrabalhadosNoAno: number) => {
  const ferias = calcularProvisaoFerias(salarioBase, mesesTrabalhadosNoAno);
  const decimo13 = calcularProvisao13(salarioBase, mesesTrabalhadosNoAno);
  
  return {
    ferias,
    decimo13,
    total: Math.round((ferias.total + decimo13.total) * 100) / 100
  };
};

export default calcularProvisoesMensais;
