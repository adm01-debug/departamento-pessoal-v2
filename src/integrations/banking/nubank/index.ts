/**
 * Integração Nubank Empresas
 * API para pagamentos, transferências e PIX
 */

export interface NubankConfig {
  clientId: string;
  clientSecret: string;
  certificado?: string;
  ambiente: "sandbox" | "producao";
}

export interface NubankTransferencia {
  id: string;
  tipo: "pix" | "ted";
  valor: number;
  destinatario: { nome: string; documento: string; banco?: string; agencia?: string; conta?: string; chavePix?: string };
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  dataEfetivacao?: string;
}

export interface NubankPix {
  txid: string;
  qrcode: string;
  pixCopiaECola: string;
  valor: number;
  status: "ACTIVE" | "COMPLETED" | "EXPIRED";
}

class NubankIntegration {
  private config: NubankConfig | null = null;
  private accessToken: string | null = null;
  private baseUrl: string = "";

  configure(config: NubankConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.nubank.com.br" : "https://api.sandbox.nubank.com.br";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    if (!this.config) throw new Error("Integração não configurada");
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`
    });
    if (!response.ok) throw new Error("Falha na autenticação Nubank");
    const data = await response.json();
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", ...options.headers }
    });
    if (!response.ok) throw new Error(`Erro Nubank: ${response.status}`);
    return response.json();
  }

  async consultarSaldo(): Promise<{ available: number; blocked: number }> {
    return this.request("/api/accounts/balance");
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<any[]> {
    return this.request(`/api/accounts/statements?startDate=${dataInicio}&endDate=${dataFim}`);
  }

  async realizarPixPagamento(dados: { chavePix: string; valor: number; descricao?: string }): Promise<NubankTransferencia> {
    return this.request("/api/pix/payments", {
      method: "POST",
      body: JSON.stringify({ pixKey: dados.chavePix, amount: dados.valor, description: dados.descricao })
    });
  }

  async gerarPixCobranca(dados: { valor: number; descricao?: string; expiracaoMinutos?: number }): Promise<NubankPix> {
    return this.request("/api/pix/qrcodes", {
      method: "POST",
      body: JSON.stringify({ amount: dados.valor, description: dados.descricao, expirationMinutes: dados.expiracaoMinutos || 60 })
    });
  }

  async consultarPix(txid: string): Promise<NubankPix> {
    return this.request(`/api/pix/qrcodes/${txid}`);
  }

  async realizarTED(dados: { valor: number; favorecido: { nome: string; documento: string; banco: string; agencia: string; conta: string } }): Promise<NubankTransferencia> {
    return this.request("/api/transfers/ted", {
      method: "POST",
      body: JSON.stringify({
        amount: dados.valor,
        beneficiary: { name: dados.favorecido.nome, document: dados.favorecido.documento, bankCode: dados.favorecido.banco, branch: dados.favorecido.agencia, account: dados.favorecido.conta }
      })
    });
  }

  async consultarTransferencia(id: string): Promise<NubankTransferencia> {
    return this.request(`/api/transfers/${id}`);
  }

  async processarFolhaPagamento(pagamentos: Array<{ colaborador: { nome: string; cpf: string; chavePix?: string; banco?: string; agencia?: string; conta?: string }; valor: number }>): Promise<{ lote: string; resultados: Array<{ id: string; status: string }> }> {
    const loteId = `FOLHA_NU_${Date.now()}`;
    const resultados = [];
    for (const pag of pagamentos) {
      try {
        let result;
        if (pag.colaborador.chavePix) {
          result = await this.realizarPixPagamento({ chavePix: pag.colaborador.chavePix, valor: pag.valor, descricao: "Pagamento salário" });
        } else {
          result = await this.realizarTED({ valor: pag.valor, favorecido: { nome: pag.colaborador.nome, documento: pag.colaborador.cpf, banco: pag.colaborador.banco!, agencia: pag.colaborador.agencia!, conta: pag.colaborador.conta! } });
        }
        resultados.push({ id: result.id, status: "processando" });
      } catch { resultados.push({ id: "", status: "erro" }); }
    }
    return { lote: loteId, resultados };
  }
}

export const nubank = new NubankIntegration();
export default nubank;
