/**
 * Integração Bradesco
 * API: https://developers.bradesco.com.br
 */

export interface BradescoConfig {
  clientId: string;
  clientSecret: string;
  certificado: string;
  ambiente: "sandbox" | "producao";
  agencia: string;
  conta: string;
}

export interface BradescoPagamento {
  tipo: "transferencia" | "boleto" | "pix";
  valor: number;
  dataVencimento: string;
  beneficiario: { nome: string; cpfCnpj: string; banco?: string; agencia?: string; conta?: string; chavePix?: string };
}

class BradescoService {
  private config: BradescoConfig | null = null;
  private token: string | null = null;
  private baseUrl = "";

  configurar(config: BradescoConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://openapi.bradesco.com.br" : "https://proxy.api.prebanco.com.br";
  }

  private async obterToken(): Promise<string> {
    if (!this.config) throw new Error("Bradesco não configurado");
    if (this.token) return this.token;

    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`
    });

    if (!response.ok) throw new Error("Falha na autenticação Bradesco");
    const data = await response.json();
    this.token = data.access_token;
    return this.token!;
  }

  async consultarSaldo(): Promise<{ disponivel: number; bloqueado: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/v1/contas/${this.config!.conta}/saldo`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Falha ao consultar saldo");
    const data = await response.json();
    return { disponivel: data.saldoDisponivel || 0, bloqueado: data.saldoBloqueado || 0 };
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<{ lancamentos: any[] }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/v1/contas/${this.config!.conta}/extrato?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Falha ao consultar extrato");
    return response.json();
  }

  async gerarBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string } }): Promise<{ codigoBarras: string; linhaDigitavel: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/v1/boletos`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ agencia: this.config!.agencia, conta: this.config!.conta, valor: dados.valor, dataVencimento: dados.vencimento, pagador: dados.pagador })
    });
    if (!response.ok) throw new Error("Falha ao gerar boleto");
    return response.json();
  }

  async realizarTransferencia(pagamento: BradescoPagamento): Promise<{ protocolo: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/v1/transferencias`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...pagamento, contaOrigem: this.config!.conta })
    });
    if (!response.ok) throw new Error("Falha na transferência");
    const data = await response.json();
    return { protocolo: data.protocolo, status: data.status };
  }

  async realizarPix(chavePix: string, valor: number, descricao?: string): Promise<{ txid: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/v1/pix/pagamentos`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ chave: chavePix, valor, descricao })
    });
    if (!response.ok) throw new Error("Falha no PIX");
    const data = await response.json();
    return { txid: data.txid, status: data.status };
  }

  async processarFolhaPagamento(pagamentos: Array<{ nome: string; cpf: string; banco: string; agencia: string; conta: string; valor: number }>): Promise<{ loteId: string; quantidade: number; valorTotal: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/v1/folha-pagamento/lotes`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ contaOrigem: this.config!.conta, pagamentos })
    });
    if (!response.ok) throw new Error("Falha ao processar folha");
    const data = await response.json();
    return { loteId: data.loteId, quantidade: pagamentos.length, valorTotal: pagamentos.reduce((s, p) => s + p.valor, 0) };
  }
}

export const bradescoService = new BradescoService();
export default bradescoService;
