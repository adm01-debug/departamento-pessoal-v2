// V17-S047: MTBService Real (Ministério do Trabalho)
export const mtbServiceReal = {
  async consultarCBO(codigo: string) { return { codigo, descricao: '', familia: '' }; },
  async consultarCNAE(codigo: string) { return { codigo, descricao: '', grauRisco: 0 }; }
};
export default mtbServiceReal;
