/**
 * Integração Bradesco
 * API Bradesco para consultas, boletos e transferências
 */

export interface BradescoConfig {
  clientId: string;
  clientSecret: string;
  certificado?: string;
  ambiente: "sandbox" | "producao";
}

export interface BradescoBoleto {
  nossoNumero: string;
  codigoBarras: string;
  linhaDigitavel: string;
  valor: number;
  dataVencimento: string;
  pagador: { nome: string; cpfCnpj: string };
  status: "EMITIDO" | "PAGO" | "VENCIDO" | "BAIXADO";
}

export interface BradescoTransferencia {
  id: string;
  tipo: "TED" | "DOC" | "PIX";
  valor: number;
  favorecido: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string };
  status: "PENDENTE" | "EFETIVADA" | "CANCELADA";
}

class BradescoIntegration {
  private config: BradescoConfig | null = null;
  private accessToken: string | null = null;
  private baseUrl: string = "";

  configure(config: BradescoConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://openapi.bradesco.com.br" : "https://proxy.api.prebanco.com.br";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    if (!this.config) throw new Error("Integração não configurada");

    const response = await fetch(`${this.baseUrl}/auth/server/v1.1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`
    });
    if (!response.ok) throw new Error("Falha na autenticação Bradesco");
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
    if (!response.ok) throw new Error(`Erro Bradesco: ${response.status}`);
    return response.json();
  }

  async consultarSaldo(agencia: string, conta: string): Promise<{ saldo: number }> {
    return this.request(`/v1/contas/${agencia}/${conta}/saldo`);
  }

  async consultarExtrato(agencia: string, conta: string, dataInicio: string, dataFim: string): Promise<any[]> {
    return this.request(`/v1/contas/${agencia}/${conta}/extrato?inicio=${dataInicio}&fim=${dataFim}`);
  }

  async emitirBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string; endereco: string } }): Promise<BradescoBoleto> {
    return this.request("/v1/boleto/registrarBoleto", {
      method: "POST",
      body: JSON.stringify({
        nuCPFCNPJ: dados.pagador.cpfCnpj.replace(/\D/g, ""),
        filialCPFCNPJ: "0001",
        ctrlCPFCNPJ: "00",
        cdEspecieTitulo: "02",
        vlNominalTitulo: dados.valor,
        dtVencimentoTitulo: dados.vencimento.replace(/-/g, "."),
        nomePagador: dados.pagador.nome,
        enderecoPagador: dados.pagador.endereco,
        nuCpfcnpjPagador: dados.pagador.cpfCnpj.replace(/\D/g, "")
      })
    });
  }

  async consultarBoleto(nossoNumero: string): Promise<BradescoBoleto> {
    return this.request(`/v1/boleto/${nossoNumero}`);
  }

  async baixarBoleto(nossoNumero: string): Promise<void> {
    await this.request(`/v1/boleto/${nossoNumero}/baixar`, { method: "POST" });
  }

  async realizarTransferencia(dados: { tipo: "TED" | "PIX"; valor: number; favorecido: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string } }): Promise<BradescoTransferencia> {
    return this.request("/v1/transferencias", { method: "POST", body: JSON.stringify(dados) });
  }

  async gerarPixCobranca(dados: { valor: number; descricao?: string }): Promise<{ qrcode: string; txid: string }> {
    return this.request("/v1/spi/pix/cob", { method: "POST", body: JSON.stringify({ valor: { original: dados.valor.toFixed(2) } }) });
  }

  async processarFolhaPagamento(pagamentos: Array<{ colaborador: { nome: string; cpf: string; banco: string; agencia: string; conta: string }; valor: number }>): Promise<{ lote: string; status: string }> {
    const loteId = `FOLHA_BRADESCO_${Date.now()}`;
    for (const pag of pagamentos) {
      await this.realizarTransferencia({ tipo: "TED", valor: pag.valor, favorecido: { nome: pag.colaborador.nome, cpfCnpj: pag.colaborador.cpf, banco: pag.colaborador.banco, agencia: pag.colaborador.agencia, conta: pag.colaborador.conta } });
    }
    return { lote: loteId, status: "processando" };
  }
}

export const bradesco = new BradescoIntegration();
export default bradesco;
