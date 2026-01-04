/**
 * Integração Caixa Econômica Federal
 * API: https://developers.caixa.gov.br
 */

export interface CaixaConfig {
  clientId: string;
  clientSecret: string;
  certificado: string;
  ambiente: "sandbox" | "producao";
  agencia: string;
  conta: string;
  operacao: string;
}

class CaixaService {
  private config: CaixaConfig | null = null;
  private token: string | null = null;
  private baseUrl = "";

  configurar(config: CaixaConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.caixa.gov.br" : "https://api-sandbox.caixa.gov.br";
  }

  private async obterToken(): Promise<string> {
    if (!this.config) throw new Error("Caixa não configurada");
    if (this.token) return this.token;
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`
    });
    if (!response.ok) throw new Error("Falha na autenticação Caixa");
    const data = await response.json();
    this.token = data.access_token;
    return this.token!;
  }

  async consultarSaldo(): Promise<{ disponivel: number; bloqueado: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/contas/v1/${this.config!.agencia}/${this.config!.operacao}/${this.config!.conta}/saldo`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Falha ao consultar saldo");
    const data = await response.json();
    return { disponivel: data.saldoDisponivel || 0, bloqueado: data.saldoBloqueado || 0 };
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<{ lancamentos: any[] }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/contas/v1/${this.config!.agencia}/${this.config!.operacao}/${this.config!.conta}/extrato?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Falha ao consultar extrato");
    return response.json();
  }

  async gerarBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string } }): Promise<{ codigoBarras: string; linhaDigitavel: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/cobranca/v2/boletos`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ unidade: this.config!.agencia, contaCorrente: this.config!.conta, ...dados })
    });
    if (!response.ok) throw new Error("Falha ao gerar boleto");
    return response.json();
  }

  async realizarTransferencia(beneficiario: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string }, valor: number): Promise<{ protocolo: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/transferencias/v1`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ contaOrigem: { agencia: this.config!.agencia, conta: this.config!.conta }, beneficiario, valor })
    });
    if (!response.ok) throw new Error("Falha na transferência");
    const data = await response.json();
    return { protocolo: data.protocolo, status: data.status };
  }

  async realizarPix(chavePix: string, valor: number, descricao?: string): Promise<{ txid: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/pix/v1/cob`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ chave: chavePix, valor: { original: valor.toFixed(2) }, solicitacaoPagador: descricao })
    });
    if (!response.ok) throw new Error("Falha no PIX");
    const data = await response.json();
    return { txid: data.txid, status: data.status };
  }

  async processarFolhaPagamento(pagamentos: Array<{ nome: string; cpf: string; banco: string; agencia: string; conta: string; valor: number }>): Promise<{ loteId: string; quantidade: number; valorTotal: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/pagamentos/v1/lotes`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ contaDebito: { agencia: this.config!.agencia, conta: this.config!.conta }, pagamentos })
    });
    if (!response.ok) throw new Error("Falha ao processar folha");
    const data = await response.json();
    return { loteId: data.idLote, quantidade: pagamentos.length, valorTotal: pagamentos.reduce((s, p) => s + p.valor, 0) };
  }

  async consultarFGTS(pis: string): Promise<{ saldo: number; dataSaldo: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/fgts/v1/consulta/${pis}`, { headers: { "Authorization": `Bearer ${token}` } });
    if (!response.ok) throw new Error("Falha ao consultar FGTS");
    return response.json();
  }
}

export const caixaService = new CaixaService();
export default caixaService;
