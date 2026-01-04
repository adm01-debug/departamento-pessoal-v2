/**
 * Integração Caixa Econômica Federal
 * API para boletos, FGTS, transferências e PIX
 */

export interface CaixaConfig {
  clientId: string;
  clientSecret: string;
  certificado?: string;
  cnpjBeneficiario: string;
  ambiente: "sandbox" | "producao";
}

export interface CaixaBoleto {
  nossoNumero: string;
  codigoBarras: string;
  linhaDigitavel: string;
  valor: number;
  dataVencimento: string;
  status: "EMITIDO" | "PAGO" | "VENCIDO" | "BAIXADO";
}

export interface CaixaFGTS {
  colaboradorCpf: string;
  saldo: number;
  ultimoDeposito: string;
  empresa: string;
}

class CaixaIntegration {
  private config: CaixaConfig | null = null;
  private accessToken: string | null = null;
  private baseUrl: string = "";

  configure(config: CaixaConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.caixa.gov.br" : "https://api-hom.caixa.gov.br";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    if (!this.config) throw new Error("Integração não configurada");
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`
    });
    if (!response.ok) throw new Error("Falha na autenticação Caixa");
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
    if (!response.ok) throw new Error(`Erro Caixa: ${response.status}`);
    return response.json();
  }

  async consultarSaldo(agencia: string, conta: string): Promise<{ saldo: number }> {
    return this.request(`/contas/v1/${agencia}/${conta}/saldo`);
  }

  async emitirBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string; endereco: string } }): Promise<CaixaBoleto> {
    return this.request("/cobranca/v2/boletos", {
      method: "POST",
      body: JSON.stringify({
        cnpjBeneficiario: this.config?.cnpjBeneficiario,
        valor: dados.valor,
        dataVencimento: dados.vencimento,
        pagador: { nome: dados.pagador.nome, cpfCnpj: dados.pagador.cpfCnpj, endereco: dados.pagador.endereco }
      })
    });
  }

  async consultarBoleto(nossoNumero: string): Promise<CaixaBoleto> {
    return this.request(`/cobranca/v2/boletos/${nossoNumero}`);
  }

  async baixarBoleto(nossoNumero: string): Promise<void> {
    await this.request(`/cobranca/v2/boletos/${nossoNumero}/baixar`, { method: "POST" });
  }

  async realizarTransferencia(dados: { tipo: "TED" | "PIX"; valor: number; favorecido: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string } }): Promise<{ id: string; status: string }> {
    return this.request("/transferencias/v1", { method: "POST", body: JSON.stringify(dados) });
  }

  async gerarPixCobranca(dados: { valor: number; descricao?: string }): Promise<{ qrcode: string; txid: string }> {
    return this.request("/pix/v1/cob", { method: "POST", body: JSON.stringify({ valor: { original: dados.valor.toFixed(2) } }) });
  }

  // Métodos específicos FGTS
  async consultarSaldoFGTS(cpf: string): Promise<CaixaFGTS> {
    return this.request(`/fgts/v1/saldo/${cpf.replace(/\D/g, "")}`);
  }

  async gerarGRRF(dados: { colaboradorCpf: string; valor: number; competencia: string }): Promise<{ codigoBarras: string; valor: number }> {
    return this.request("/fgts/v1/grrf", { method: "POST", body: JSON.stringify(dados) });
  }

  async consultarDepositosFGTS(cpf: string, anoInicio: number, anoFim: number): Promise<any[]> {
    return this.request(`/fgts/v1/depositos/${cpf}?anoInicio=${anoInicio}&anoFim=${anoFim}`);
  }

  async processarFolhaPagamento(pagamentos: Array<{ colaborador: { nome: string; cpf: string; banco: string; agencia: string; conta: string }; valor: number }>): Promise<{ lote: string; status: string }> {
    const loteId = `FOLHA_CAIXA_${Date.now()}`;
    for (const pag of pagamentos) {
      await this.realizarTransferencia({ tipo: "TED", valor: pag.valor, favorecido: { nome: pag.colaborador.nome, cpfCnpj: pag.colaborador.cpf, banco: pag.colaborador.banco, agencia: pag.colaborador.agencia, conta: pag.colaborador.conta } });
    }
    return { lote: loteId, status: "processando" };
  }
}

export const caixa = new CaixaIntegration();
export default caixa;
