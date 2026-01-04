/**
 * Integração Santander Brasil
 * API: https://developer.santander.com.br
 */

export interface SantanderConfig {
  clientId: string;
  clientSecret: string;
  certificado: string;
  ambiente: "sandbox" | "producao";
  agencia: string;
  conta: string;
}

class SantanderService {
  private config: SantanderConfig | null = null;
  private token: string | null = null;
  private baseUrl = "";

  configurar(config: SantanderConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.santander.com.br" : "https://api-sandbox.santander.com.br";
  }

  private async obterToken(): Promise<string> {
    if (!this.config) throw new Error("Santander não configurado");
    if (this.token) return this.token;
    const response = await fetch(`${this.baseUrl}/auth/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`
    });
    if (!response.ok) throw new Error("Falha na autenticação Santander");
    const data = await response.json();
    this.token = data.access_token;
    return this.token!;
  }

  async consultarSaldo(): Promise<{ disponivel: number; bloqueado: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/bank_account_information/v1/accounts/${this.config!.conta}/balance`, {
      headers: { "Authorization": `Bearer ${token}`, "X-Application-Key": this.config!.clientId }
    });
    if (!response.ok) throw new Error("Falha ao consultar saldo");
    const data = await response.json();
    return { disponivel: data.availableBalance || 0, bloqueado: data.blockedBalance || 0 };
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<{ lancamentos: any[] }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/bank_account_information/v1/accounts/${this.config!.conta}/statement?startDate=${dataInicio}&endDate=${dataFim}`, {
      headers: { "Authorization": `Bearer ${token}`, "X-Application-Key": this.config!.clientId }
    });
    if (!response.ok) throw new Error("Falha ao consultar extrato");
    return response.json();
  }

  async gerarBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string } }): Promise<{ codigoBarras: string; linhaDigitavel: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/collection/v2/workspaces/default/bank_slips`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ beneficiaryAccount: { agency: this.config!.agencia, account: this.config!.conta }, ...dados })
    });
    if (!response.ok) throw new Error("Falha ao gerar boleto");
    return response.json();
  }

  async realizarTransferencia(beneficiario: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string }, valor: number): Promise<{ protocolo: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/payment_invoices/v1/transfers`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ debitAccount: { agency: this.config!.agencia, account: this.config!.conta }, creditAccount: beneficiario, amount: valor })
    });
    if (!response.ok) throw new Error("Falha na transferência");
    const data = await response.json();
    return { protocolo: data.transactionId, status: data.status };
  }

  async realizarPix(chavePix: string, valor: number, descricao?: string): Promise<{ txid: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/pix/v2/cob`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ chave: chavePix, valor: { original: valor.toFixed(2) }, infoAdicional: descricao })
    });
    if (!response.ok) throw new Error("Falha no PIX");
    const data = await response.json();
    return { txid: data.txid, status: data.status };
  }

  async processarFolhaPagamento(pagamentos: Array<{ nome: string; cpf: string; banco: string; agencia: string; conta: string; valor: number }>): Promise<{ loteId: string; quantidade: number; valorTotal: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/payment_invoices/v1/payroll/batches`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ debitAccount: { agency: this.config!.agencia, account: this.config!.conta }, payments: pagamentos })
    });
    if (!response.ok) throw new Error("Falha ao processar folha");
    const data = await response.json();
    return { loteId: data.batchId, quantidade: pagamentos.length, valorTotal: pagamentos.reduce((s, p) => s + p.valor, 0) };
  }
}

export const santanderService = new SantanderService();
export default santanderService;
