/**
 * Integração Santander Brasil
 * API para boletos, transferências e PIX
 */

export interface SantanderConfig {
  clientId: string;
  clientSecret: string;
  certificado?: string;
  workspace?: string;
  ambiente: "sandbox" | "producao";
}

export interface SantanderBoleto {
  codigoBarras: string;
  linhaDigitavel: string;
  nossoNumero: string;
  valor: number;
  dataVencimento: string;
  status: "REGISTRADO" | "LIQUIDADO" | "BAIXADO";
}

class SantanderIntegration {
  private config: SantanderConfig | null = null;
  private accessToken: string | null = null;
  private baseUrl: string = "";

  configure(config: SantanderConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://trust-open.api.santander.com.br" : "https://trust-sandbox.api.santander.com.br";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    if (!this.config) throw new Error("Integração não configurada");
    const response = await fetch(`${this.baseUrl}/auth/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`
    });
    if (!response.ok) throw new Error("Falha na autenticação Santander");
    const data = await response.json();
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "X-Application-Key": this.config?.clientId || "", ...options.headers }
    });
    if (!response.ok) throw new Error(`Erro Santander: ${response.status}`);
    return response.json();
  }

  async consultarSaldo(agencia: string, conta: string): Promise<{ saldo: number; saldoDisponivel: number }> {
    return this.request(`/bank_account_information/v1/balance?branch=${agencia}&number=${conta}`);
  }

  async emitirBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string; endereco: string } }): Promise<SantanderBoleto> {
    return this.request("/collection/v2/workspaces/default/bank_slips", {
      method: "POST",
      body: JSON.stringify({
        environment: { type: this.config?.ambiente === "producao" ? "PRODUCTION" : "TEST" },
        bank_slip: { due_date: dados.vencimento, nominal_value: dados.valor },
        payer: { name: dados.pagador.nome, document: { type: dados.pagador.cpfCnpj.length === 11 ? "CPF" : "CNPJ", value: dados.pagador.cpfCnpj }, address: { street: dados.pagador.endereco } }
      })
    });
  }

  async consultarBoleto(id: string): Promise<SantanderBoleto> {
    return this.request(`/collection/v2/workspaces/default/bank_slips/${id}`);
  }

  async baixarBoleto(id: string): Promise<void> {
    await this.request(`/collection/v2/workspaces/default/bank_slips/${id}/write_off`, { method: "PATCH" });
  }

  async realizarTransferencia(dados: { tipo: "TED" | "PIX"; valor: number; favorecido: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string } }): Promise<{ id: string; status: string }> {
    return this.request("/payments/v1/transfers", { method: "POST", body: JSON.stringify({ type: dados.tipo, amount: dados.valor, beneficiary: dados.favorecido }) });
  }

  async gerarPixCobranca(dados: { valor: number; descricao?: string }): Promise<{ qrcode: string; txid: string }> {
    return this.request("/pix/v2/cob", { method: "POST", body: JSON.stringify({ valor: { original: dados.valor.toFixed(2) } }) });
  }

  async processarFolhaPagamento(pagamentos: Array<{ colaborador: { nome: string; cpf: string; banco: string; agencia: string; conta: string }; valor: number }>): Promise<{ lote: string; status: string }> {
    const loteId = `FOLHA_SANT_${Date.now()}`;
    for (const pag of pagamentos) {
      await this.realizarTransferencia({ tipo: "TED", valor: pag.valor, favorecido: { nome: pag.colaborador.nome, cpfCnpj: pag.colaborador.cpf, banco: pag.colaborador.banco, agencia: pag.colaborador.agencia, conta: pag.colaborador.conta } });
    }
    return { lote: loteId, status: "processando" };
  }
}

export const santander = new SantanderIntegration();
export default santander;
