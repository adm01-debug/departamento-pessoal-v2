/**
 * Cálculo de Auxílio Creche de acordo com convenção coletiva.
 */
export const calcularAuxilioCreche = (valorPorFilho: number, numeroFilhos: number) => {
  return {
    valorPorFilho,
    numeroFilhos,
    total: Math.round(valorPorFilho * numeroFilhos * 100) / 100
  };
};

export default calcularAuxilioCreche;
