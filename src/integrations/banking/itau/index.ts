/**
 * Integração Itaú Unibanco
 * API: https://developer.itau.com.br
 */

export interface ItauConfig {
  clientId: string;
  clientSecret: string;
  certificado: string;
  ambiente: "sandbox" | "producao";
  agencia: string;
  conta: string;
}

class ItauService {
  private config: ItauConfig | null = null;
  private token: string | null = null;
  private baseUrl = "";

  configurar(config: ItauConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.itau.com.br" : "https://api.sandbox.itau.com.br";
  }

  private async obterToken(): Promise<string> {
    if (!this.config) throw new Error("Itaú não configurado");
    if (this.token) return this.token;
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`
    });
    if (!response.ok) throw new Error("Falha na autenticação Itaú");
    const data = await response.json();
    this.token = data.access_token;
    return this.token!;
  }

  async consultarSaldo(): Promise<{ disponivel: number; bloqueado: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/conta_corrente/v1/saldo`, {
      headers: { "Authorization": `Bearer ${token}`, "x-itau-agencia": this.config!.agencia, "x-itau-conta": this.config!.conta }
    });
    if (!response.ok) throw new Error("Falha ao consultar saldo");
    const data = await response.json();
    return { disponivel: data.saldo_disponivel || 0, bloqueado: data.saldo_bloqueado || 0 };
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<{ lancamentos: any[] }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/conta_corrente/v1/extrato?data_inicio=${dataInicio}&data_fim=${dataFim}`, {
      headers: { "Authorization": `Bearer ${token}`, "x-itau-agencia": this.config!.agencia, "x-itau-conta": this.config!.conta }
    });
    if (!response.ok) throw new Error("Falha ao consultar extrato");
    return response.json();
  }

  async gerarBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string } }): Promise<{ codigoBarras: string; linhaDigitavel: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/boletos/v2`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ agencia: this.config!.agencia, conta: this.config!.conta, ...dados })
    });
    if (!response.ok) throw new Error("Falha ao gerar boleto");
    return response.json();
  }

  async realizarTransferencia(beneficiario: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string }, valor: number): Promise<{ protocolo: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/transferencias/v2`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ conta_debito: { agencia: this.config!.agencia, conta: this.config!.conta }, beneficiario, valor })
    });
    if (!response.ok) throw new Error("Falha na transferência");
    const data = await response.json();
    return { protocolo: data.numero_protocolo, status: data.situacao };
  }

  async realizarPix(chavePix: string, valor: number, descricao?: string): Promise<{ txid: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/pix/v2/cob`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ chave: chavePix, valor: { original: valor.toFixed(2) }, infoAdicionais: descricao ? [{ nome: "desc", valor: descricao }] : [] })
    });
    if (!response.ok) throw new Error("Falha no PIX");
    const data = await response.json();
    return { txid: data.txid, status: data.status };
  }

  async processarFolhaPagamento(pagamentos: Array<{ nome: string; cpf: string; banco: string; agencia: string; conta: string; valor: number }>): Promise<{ loteId: string; quantidade: number; valorTotal: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/pagamentos/v2/lotes`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ conta_debito: { agencia: this.config!.agencia, conta: this.config!.conta }, lancamentos: pagamentos })
    });
    if (!response.ok) throw new Error("Falha ao processar folha");
    const data = await response.json();
    return { loteId: data.id_lote, quantidade: pagamentos.length, valorTotal: pagamentos.reduce((s, p) => s + p.valor, 0) };
  }
}

export const itauService = new ItauService();
export default itauService;
