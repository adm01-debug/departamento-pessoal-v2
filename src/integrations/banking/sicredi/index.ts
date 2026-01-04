/**
 * Integração Sicredi
 * API para boletos, PIX e transferências cooperativas
 */

export interface SicrediConfig {
  apiKey: string;
  cooperativa: string;
  posto: string;
  codigoBeneficiario: string;
  certificado?: string;
  ambiente: "sandbox" | "producao";
}

export interface SicrediBoleto {
  nossoNumero: string;
  codigoBarras: string;
  linhaDigitavel: string;
  valor: number;
  dataVencimento: string;
  situacao: "PENDENTE" | "PAGO" | "BAIXADO" | "PROTESTADO";
}

class SicrediIntegration {
  private config: SicrediConfig | null = null;
  private accessToken: string | null = null;
  private baseUrl: string = "";

  configure(config: SicrediConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.sicredi.com.br" : "https://api-sandbox.sicredi.com.br";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    if (!this.config) throw new Error("Integração não configurada");
    const response = await fetch(`${this.baseUrl}/auth/openapi/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "x-api-key": this.config.apiKey },
      body: "grant_type=client_credentials&scope=cobranca"
    });
    if (!response.ok) throw new Error("Falha na autenticação Sicredi");
    const data = await response.json();
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "x-api-key": this.config?.apiKey || "", "cooperativa": this.config?.cooperativa || "", "posto": this.config?.posto || "", ...options.headers }
    });
    if (!response.ok) throw new Error(`Erro Sicredi: ${response.status}`);
    return response.json();
  }

  async consultarSaldo(): Promise<{ saldoDisponivel: number }> {
    return this.request("/conta/v1/saldo");
  }

  async emitirBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string; endereco: string; cidade: string; uf: string; cep: string } }): Promise<SicrediBoleto> {
    return this.request("/cobranca/boleto/v1/boletos", {
      method: "POST",
      body: JSON.stringify({
        codigoBeneficiario: this.config?.codigoBeneficiario,
        especieDocumento: "A",
        seuNumero: `${Date.now()}`,
        dataVencimento: dados.vencimento,
        valor: dados.valor,
        tipoDesconto: "ISENTO",
        tipoJuros: "ISENTO",
        tipoMulta: "ISENTO",
        tipoPessoa: dados.pagador.cpfCnpj.length === 11 ? "PESSOA_FISICA" : "PESSOA_JURIDICA",
        cpfCnpj: dados.pagador.cpfCnpj.replace(/\D/g, ""),
        nome: dados.pagador.nome,
        endereco: dados.pagador.endereco,
        cidade: dados.pagador.cidade,
        uf: dados.pagador.uf,
        cep: dados.pagador.cep.replace(/\D/g, ""),
        telefone: "",
        email: ""
      })
    });
  }

  async consultarBoleto(nossoNumero: string): Promise<SicrediBoleto> {
    return this.request(`/cobranca/boleto/v1/boletos/${nossoNumero}`);
  }

  async listarBoletos(dataInicio: string, dataFim: string): Promise<SicrediBoleto[]> {
    const result = await this.request<{ boletos: SicrediBoleto[] }>(`/cobranca/boleto/v1/boletos?dataInicio=${dataInicio}&dataFim=${dataFim}`);
    return result.boletos || [];
  }

  async baixarBoleto(nossoNumero: string): Promise<void> {
    await this.request(`/cobranca/boleto/v1/boletos/${nossoNumero}/baixa`, { method: "PATCH" });
  }

  async gerarPixCobranca(dados: { valor: number; descricao?: string }): Promise<{ txid: string; qrcode: string; pixCopiaECola: string }> {
    return this.request("/pix/v2/cob", {
      method: "POST",
      body: JSON.stringify({ valor: { original: dados.valor.toFixed(2) }, calendario: { expiracao: 3600 } })
    });
  }

  async consultarPix(txid: string): Promise<any> {
    return this.request(`/pix/v2/cob/${txid}`);
  }

  async realizarTransferencia(dados: { tipo: "TED" | "PIX"; valor: number; favorecido: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string } }): Promise<{ id: string; status: string }> {
    return this.request("/transferencia/v1", { method: "POST", body: JSON.stringify(dados) });
  }

  async processarFolhaPagamento(pagamentos: Array<{ colaborador: { nome: string; cpf: string; banco: string; agencia: string; conta: string }; valor: number }>): Promise<{ lote: string; status: string }> {
    const loteId = `FOLHA_SICREDI_${Date.now()}`;
    for (const pag of pagamentos) {
      await this.realizarTransferencia({ tipo: "TED", valor: pag.valor, favorecido: { nome: pag.colaborador.nome, cpfCnpj: pag.colaborador.cpf, banco: pag.colaborador.banco, agencia: pag.colaborador.agencia, conta: pag.colaborador.conta } });
    }
    return { lote: loteId, status: "processando" };
  }
}

export const sicredi = new SicrediIntegration();
export default sicredi;
