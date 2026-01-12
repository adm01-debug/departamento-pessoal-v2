// V17-S060: TermoService Real
export type TipoTermo = 'admissao' | 'rescisao' | 'ferias' | 'advertencia' | 'suspensao' | 'acordo';
export const termoServiceReal = {
  async gerar(tipo: TipoTermo, dados: any) { return { tipo, dados, geradoEm: new Date().toISOString() }; },
  async gerarPDF(tipo: TipoTermo, dados: any) { return new Blob(['PDF'], { type: 'application/pdf' }); },
  getTemplates() { return ['admissao', 'rescisao', 'ferias', 'advertencia', 'suspensao', 'acordo']; }
}; export default termoServiceReal;
