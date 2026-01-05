export interface LancamentoContabil { data: string; debito: string; credito: string; valor: number; historico: string; documento?: string; }
export interface IntegracaoContabilConfig { sistema: "DOMINIO" | "TOTVS" | "SAP" | "SENIOR" | "OUTROS"; formato: "XML" | "TXT" | "CSV" | "API"; planoContas: Record<string, string>; }
export class ContabilidadeService {
  private config: IntegracaoContabilConfig;
  constructor(config: IntegracaoContabilConfig) { this.config = config; }
  async gerarLancamentosFolha(competencia: string, folha: any): Promise<LancamentoContabil[]> {
    const lancamentos: LancamentoContabil[] = [];
    lancamentos.push({ data: `${competencia}-30`, debito: this.config.planoContas["SALARIOS"] || "3.1.1.01", credito: this.config.planoContas["SALARIOS_PAGAR"] || "2.1.2.01", valor: folha.totalSalarios, historico: `Folha ${competencia} - Salários` });
    lancamentos.push({ data: `${competencia}-30`, debito: this.config.planoContas["INSS_EMPRESA"] || "3.1.1.02", credito: this.config.planoContas["INSS_PAGAR"] || "2.1.2.02", valor: folha.inssPatronal, historico: `Folha ${competencia} - INSS Patronal` });
    lancamentos.push({ data: `${competencia}-30`, debito: this.config.planoContas["FGTS"] || "3.1.1.03", credito: this.config.planoContas["FGTS_PAGAR"] || "2.1.2.03", valor: folha.fgts, historico: `Folha ${competencia} - FGTS` });
    return lancamentos;
  }
  async exportar(lancamentos: LancamentoContabil[]): Promise<string> {
    if (this.config.formato === "CSV") return lancamentos.map(l => `${l.data};${l.debito};${l.credito};${l.valor};${l.historico}`).join("\n");
    return JSON.stringify(lancamentos);
  }
}
export default ContabilidadeService;
