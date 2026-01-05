export interface DCTFWebConfig { certificadoPath: string; senha: string; ambiente: "PRODUCAO" | "HOMOLOGACAO"; cnpj: string; }
export interface DCTFWebDeclaracao { competencia: string; tipo: "MENSAL" | "ANUAL" | "DIARIA" | "13_SALARIO"; debitos: { codigoReceita: string; descricao: string; valor: number; dataVencimento: string; }[]; totalDebitos: number; status: "PENDENTE" | "TRANSMITIDA" | "RETIFICADORA"; }
export class DCTFWebService {
  private config: DCTFWebConfig;
  constructor(config: DCTFWebConfig) { this.config = config; }
  async gerarDeclaracao(competencia: string, dadosFolha: any): Promise<DCTFWebDeclaracao> {
    const debitos = [
      { codigoReceita: "1138", descricao: "INSS Patronal", valor: dadosFolha.inssPatronal || 0, dataVencimento: this.calcularVencimento(competencia) },
      { codigoReceita: "1141", descricao: "INSS Terceiros", valor: dadosFolha.inssTerceiros || 0, dataVencimento: this.calcularVencimento(competencia) },
      { codigoReceita: "0561", descricao: "IRRF Trabalho", valor: dadosFolha.irrf || 0, dataVencimento: this.calcularVencimento(competencia) },
      { codigoReceita: "0588", descricao: "CSLL", valor: dadosFolha.csll || 0, dataVencimento: this.calcularVencimento(competencia) },
    ].filter(d => d.valor > 0);
    return { competencia, tipo: "MENSAL", debitos, totalDebitos: debitos.reduce((a, d) => a + d.valor, 0), status: "PENDENTE" };
  }
  private calcularVencimento(competencia: string): string { const [ano, mes] = competencia.split("-").map(Number); return new Date(ano, mes, 20).toISOString().split("T")[0]; }
  async transmitir(declaracao: DCTFWebDeclaracao): Promise<{ protocolo: string; recibo: string }> { return { protocolo: `DCTF${Date.now()}`, recibo: `REC${Date.now()}` }; }
  async consultar(protocolo: string): Promise<{ status: string; mensagem: string }> { return { status: "PROCESSADA", mensagem: "Declaração processada com sucesso" }; }
}
export const createDCTFWebService = (config: DCTFWebConfig) => new DCTFWebService(config);
export default DCTFWebService;
