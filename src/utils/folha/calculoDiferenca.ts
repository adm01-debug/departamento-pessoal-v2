/**
 * Cálculo de diferença salarial para reajustes retroativos ou erros de folha.
 */
export const calcularDiferencaSalarial = (valorPago: number, valorDevido: number) => {
  const diferenca = Math.max(0, valorDevido - valorPago);
  return {
    valorPago,
    valorDevido,
    diferenca: Math.round(diferenca * 100) / 100
  };
};

export default calcularDiferencaSalarial;
