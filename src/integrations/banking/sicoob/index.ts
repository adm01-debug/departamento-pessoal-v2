/**
 * Integração Sicoob
 * API para boletos, PIX e transferências cooperativas
 */

export interface SicoobConfig {
  clientId: string;
  certificado: string;
  chavePrivada: string;
  numeroCooperativa: string;
  numeroContaCorrente: string;
  ambiente: "sandbox" | "producao";
}

export interface SicoobBoleto {
  nossoNumero: number;
  codigoBarras: string;
  linhaDigitavel: string;
  valor: number;
  dataVencimento: string;
  situacao: "EM_ABERTO" | "BAIXADO" | "LIQUIDADO";
}

class SicoobIntegration {
  private config: SicoobConfig | null = null;
  private accessToken: string | null = null;
  private baseUrl: string = "";

  configure(config: SicoobConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.sicoob.com.br" : "https://sandbox.sicoob.com.br";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    if (!this.config) throw new Error("Integração não configurada");
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&scope=cobranca_boletos_consultar cobranca_boletos_incluir pix_cob`
    });
    if (!response.ok) throw new Error("Falha na autenticação Sicoob");
    const data = await response.json();
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "client_id": this.config?.clientId || "", ...options.headers }
    });
    if (!response.ok) throw new Error(`Erro Sicoob: ${response.status}`);
    return response.json();
  }

  async consultarSaldo(): Promise<{ saldoDisponivel: number; saldoBloqueado: number }> {
    return this.request(`/conta-corrente/v1/contas/${this.config?.numeroContaCorrente}/saldo`);
  }

  async emitirBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string; endereco: string; cidade: string; uf: string; cep: string } }): Promise<SicoobBoleto> {
    return this.request("/cobranca-bancaria/v2/boletos", {
      method: "POST",
      body: JSON.stringify({
        numeroContrato: 0,
        modalidade: 1,
        numeroContaCorrente: Number(this.config?.numeroContaCorrente),
        especieDocumento: "DM",
        dataEmissao: new Date().toISOString().split("T")[0],
        seuNumero: `${Date.now()}`,
        identificacaoBoletoEmpresa: `BOL${Date.now()}`,
        identificacaoEmissaoBoleto: 2,
        valor: dados.valor,
        dataVencimento: dados.vencimento,
        pagador: { numeroCpfCnpj: dados.pagador.cpfCnpj.replace(/\D/g, ""), nome: dados.pagador.nome, endereco: dados.pagador.endereco, cidade: dados.pagador.cidade, uf: dados.pagador.uf, cep: dados.pagador.cep.replace(/\D/g, "") }
      })
    });
  }

  async consultarBoleto(nossoNumero: number): Promise<SicoobBoleto> {
    return this.request(`/cobranca-bancaria/v2/boletos?nossoNumero=${nossoNumero}`);
  }

  async baixarBoleto(nossoNumero: number): Promise<void> {
    await this.request(`/cobranca-bancaria/v2/boletos/${nossoNumero}/baixar`, { method: "POST" });
  }

  async gerarPixCobranca(dados: { valor: number; descricao?: string; expiracao?: number }): Promise<{ txid: string; qrcode: string; pixCopiaECola: string }> {
    return this.request("/pix/api/v2/cob", {
      method: "POST",
      body: JSON.stringify({ calendario: { expiracao: dados.expiracao || 3600 }, valor: { original: dados.valor.toFixed(2) }, infoAdicionais: dados.descricao ? [{ nome: "Descricao", valor: dados.descricao }] : [] })
    });
  }

  async consultarPix(txid: string): Promise<any> {
    return this.request(`/pix/api/v2/cob/${txid}`);
  }

  async realizarTransferencia(dados: { tipo: "TED" | "PIX"; valor: number; favorecido: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string } }): Promise<{ id: string; status: string }> {
    return this.request("/conta-corrente/v1/transferencias", { method: "POST", body: JSON.stringify(dados) });
  }

  async processarFolhaPagamento(pagamentos: Array<{ colaborador: { nome: string; cpf: string; banco: string; agencia: string; conta: string }; valor: number }>): Promise<{ lote: string; status: string }> {
    const loteId = `FOLHA_SICOOB_${Date.now()}`;
    for (const pag of pagamentos) {
      await this.realizarTransferencia({ tipo: "TED", valor: pag.valor, favorecido: { nome: pag.colaborador.nome, cpfCnpj: pag.colaborador.cpf, banco: pag.colaborador.banco, agencia: pag.colaborador.agencia, conta: pag.colaborador.conta } });
    }
    return { lote: loteId, status: "processando" };
  }
}

export const sicoob = new SicoobIntegration();
export default sicoob;
