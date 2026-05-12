/**
 * Utilitários para processamento de eventos de folha (Rubricas).
 */
export const processarEventoFolha = (valor: number, tipo: 'provento' | 'desconto', incideINSS: boolean = true, incideIRRF: boolean = true, incideFGTS: boolean = true) => {
  return {
    valor,
    tipo,
    incidencias: {
      inss: incideINSS,
      irrf: incideIRRF,
      fgts: incideFGTS
    }
  };
};

export default processarEventoFolha;
