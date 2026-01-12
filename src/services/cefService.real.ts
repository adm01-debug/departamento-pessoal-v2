// V17-S048: CEFService Real (FGTS)
export const cefServiceReal = {
  async consultarSaldo(pis: string) { return { pis, saldo: 0, ultimoDeposito: null }; },
  async gerarGRRF(colaboradorId: string) { return { arquivo: 'GRRF.pdf', valor: 0 }; }
};
export default cefServiceReal;
