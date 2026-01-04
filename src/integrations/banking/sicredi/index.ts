/**
 * Integração Sicredi
 * API: https://developers.sicredi.com.br
 */

export interface SicrediConfig {
  apiKey: string;
  cooperativa: string;
  posto: string;
  codigoBeneficiario: string;
  ambiente: "sandbox" | "producao";
}

class SicrediService {
  private config: SicrediConfig | null = null;
  private token: string | null = null;
  private baseUrl = "";

  configurar(config: SicrediConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.sicredi.com.br" : "https://api-sandbox.sicredi.com.br";
  }

  private async obterToken(): Promise<string> {
    if (!this.config) throw new Error("Sicredi não configurado");
    if (this.token) return this.token;
    const response = await fetch(`${this.baseUrl}/auth/openapi/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "x-api-key": this.config.apiKey },
      body: `grant_type=client_credentials&scope=cobranca pix`
    });
    if (!response.ok) throw new Error("Falha na autenticação Sicredi");
    const data = await response.json();
    this.token = data.access_token;
    return this.token!;
  }

  async consultarSaldo(): Promise<{ disponivel: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/conta/v1/saldo`, {
      headers: { "Authorization": `Bearer ${token}`, "x-api-key": this.config!.apiKey, "cooperativa": this.config!.cooperativa, "posto": this.config!.posto }
    });
    if (!response.ok) throw new Error("Falha ao consultar saldo");
    const data = await response.json();
    return { disponivel: data.saldo || 0 };
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<{ lancamentos: any[] }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/conta/v1/extrato?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
      headers: { "Authorization": `Bearer ${token}`, "x-api-key": this.config!.apiKey, "cooperativa": this.config!.cooperativa }
    });
    if (!response.ok) throw new Error("Falha ao consultar extrato");
    return response.json();
  }

  async gerarBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string; endereco: string; cep: string; cidade: string; uf: string } }): Promise<{ nossoNumero: string; linhaDigitavel: string; codigoBarras: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/cobranca/boleto/v1/boletos`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "x-api-key": this.config!.apiKey, "cooperativa": this.config!.cooperativa, "posto": this.config!.posto, "codigoBeneficiario": this.config!.codigoBeneficiario },
      body: JSON.stringify({ tipoCobranca: "NORMAL", especieDocumento: "DMI", seuNumero: Date.now().toString(), dataVencimento: dados.vencimento, valor: dados.valor, pagador: dados.pagador })
    });
    if (!response.ok) throw new Error("Falha ao gerar boleto");
    return response.json();
  }

  async realizarPix(chavePix: string, valor: number, descricao?: string): Promise<{ txid: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/pix/api/v2/cob`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "x-api-key": this.config!.apiKey },
      body: JSON.stringify({ calendario: { expiracao: 3600 }, valor: { original: valor.toFixed(2) }, chave: chavePix, solicitacaoPagador: descricao || "Pagamento" })
    });
    if (!response.ok) throw new Error("Falha no PIX");
    const data = await response.json();
    return { txid: data.txid, status: data.status };
  }

  async processarFolhaPagamento(pagamentos: Array<{ nome: string; cpf: string; banco: string; agencia: string; conta: string; valor: number }>): Promise<{ loteId: string; quantidade: number; valorTotal: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/pagamentos/v1/lotes`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "x-api-key": this.config!.apiKey },
      body: JSON.stringify({ pagamentos: pagamentos.map(p => ({ favorecido: p.nome, cpfCnpj: p.cpf, banco: p.banco, agencia: p.agencia, conta: p.conta, valor: p.valor })) })
    });
    if (!response.ok) throw new Error("Falha ao processar folha");
    const data = await response.json();
    return { loteId: data.idLote, quantidade: pagamentos.length, valorTotal: pagamentos.reduce((s, p) => s + p.valor, 0) };
  }
}

export const sicrediService = new SicrediService();
export default sicrediService;
