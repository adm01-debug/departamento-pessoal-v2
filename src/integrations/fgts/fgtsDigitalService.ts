export interface FGTSDigitalConfig { certificadoPath: string; senha: string; ambiente: "PRODUCAO" | "HOMOLOGACAO"; cnpjEmpregador: string; }
export interface GuiaFGTSDigital { competencia: string; tipoGuia: "MENSAL" | "RESCISORIA" | "13_SALARIO"; colaboradores: { cpf: string; nome: string; remuneracao: number; baseCalculo: number; valorFGTS: number; }[]; totalRemuneracao: number; totalFGTS: number; dataVencimento: string; codigoBarras?: string; linhaDigitavel?: string; }
export class FGTSDigitalService {
  private config: FGTSDigitalConfig;
  private baseUrl: string;
  constructor(config: FGTSDigitalConfig) { this.config = config; this.baseUrl = config.ambiente === "PRODUCAO" ? "https://fgtsdigital.caixa.gov.br/api" : "https://fgtsdigital-hom.caixa.gov.br/api"; }
  async gerarGuiaMensal(competencia: string, dados: any[]): Promise<GuiaFGTSDigital> {
    const colaboradores = dados.map(d => ({ cpf: d.cpf, nome: d.nome, remuneracao: d.remuneracao, baseCalculo: d.baseCalculo || d.remuneracao, valorFGTS: Number((d.baseCalculo * 0.08).toFixed(2)) }));
    const totalRemuneracao = colaboradores.reduce((a, c) => a + c.remuneracao, 0);
    const totalFGTS = colaboradores.reduce((a, c) => a + c.valorFGTS, 0);
    const [ano, mes] = competencia.split("-").map(Number);
    const vencimento = new Date(ano, mes, 7);
    return { competencia, tipoGuia: "MENSAL", colaboradores, totalRemuneracao: Number(totalRemuneracao.toFixed(2)), totalFGTS: Number(totalFGTS.toFixed(2)), dataVencimento: vencimento.toISOString().split("T")[0] };
  }
  async gerarGuiaRescisoria(cpf: string, saldoFGTS: number, multaFGTS: number): Promise<GuiaFGTSDigital> {
    const competencia = new Date().toISOString().substring(0, 7);
    return { competencia, tipoGuia: "RESCISORIA", colaboradores: [{ cpf, nome: "", remuneracao: 0, baseCalculo: saldoFGTS, valorFGTS: multaFGTS }], totalRemuneracao: saldoFGTS, totalFGTS: multaFGTS, dataVencimento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] };
  }
  async consultarSaldo(cpf: string): Promise<{ saldo: number; ultimoDeposito: string }> { return { saldo: 0, ultimoDeposito: "" }; }
  async enviarDeclaracao(guia: GuiaFGTSDigital): Promise<{ protocolo: string; status: string }> { return { protocolo: `FGTS${Date.now()}`, status: "ENVIADO" }; }
}
export const createFGTSDigitalService = (config: FGTSDigitalConfig) => new FGTSDigitalService(config);
export default FGTSDigitalService;
