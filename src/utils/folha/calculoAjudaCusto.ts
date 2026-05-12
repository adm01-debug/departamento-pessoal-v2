/**
 * Cálculo de ajuda de custo para transferência ou despesas operacionais.
 * Isento de encargos sociais se possuir natureza indenizatória.
 */
export const calcularAjudaCusto = (valorBase: number, dias: number = 1) => {
  return {
    valorUnitario: valorBase,
    dias,
    total: Math.round(valorBase * dias * 100) / 100
  };
};

export default calcularAjudaCusto;
