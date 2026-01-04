/**
 * Integração Sicoob
 * API: https://developers.sicoob.com.br
 */

export interface SicoobConfig {
  clientId: string;
  certificado: string;
  chaveCertificado: string;
  ambiente: "sandbox" | "producao";
  numeroContrato: string;
}

class SicoobService {
  private config: SicoobConfig | null = null;
  private token: string | null = null;
  private baseUrl = "";

  configurar(config: SicoobConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.sicoob.com.br" : "https://sandbox.sicoob.com.br";
  }

  private async obterToken(): Promise<string> {
    if (!this.config) throw new Error("Sicoob não configurado");
    if (this.token) return this.token;
    const response = await fetch(`${this.baseUrl}/cooperado/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&scope=cobranca_boletos_consultar cobranca_boletos_incluir cobranca_boletos_pagador pix_cob_write pix_cob_read conta_corrente_saldo conta_corrente_extrato`
    });
    if (!response.ok) throw new Error("Falha na autenticação Sicoob");
    const data = await response.json();
    this.token = data.access_token;
    return this.token!;
  }

  async consultarSaldo(): Promise<{ disponivel: number; bloqueado: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/conta-corrente/v2/saldo?numeroContaCorrente=${this.config!.numeroContrato}`, {
      headers: { "Authorization": `Bearer ${token}`, "client_id": this.config!.clientId }
    });
    if (!response.ok) throw new Error("Falha ao consultar saldo");
    const data = await response.json();
    return { disponivel: data.saldoDisponivel || 0, bloqueado: data.saldoBloqueado || 0 };
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<{ lancamentos: any[] }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/conta-corrente/v2/extrato?numeroContaCorrente=${this.config!.numeroContrato}&dataInicio=${dataInicio}&dataFim=${dataFim}`, {
      headers: { "Authorization": `Bearer ${token}`, "client_id": this.config!.clientId }
    });
    if (!response.ok) throw new Error("Falha ao consultar extrato");
    return response.json();
  }

  async gerarBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string; endereco: string } }): Promise<{ nossoNumero: string; linhaDigitavel: string; codigoBarras: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/cobranca-bancaria/v2/boletos`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "client_id": this.config!.clientId },
      body: JSON.stringify({ numeroContrato: this.config!.numeroContrato, modalidade: 1, seuNumero: Date.now().toString(), dataVencimento: dados.vencimento, valor: dados.valor, pagador: dados.pagador })
    });
    if (!response.ok) throw new Error("Falha ao gerar boleto");
    return response.json();
  }

  async realizarPix(chavePix: string, valor: number, descricao?: string): Promise<{ txid: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/pix/api/v2/cob`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "client_id": this.config!.clientId },
      body: JSON.stringify({ calendario: { expiracao: 3600 }, devedor: { nome: "Pagamento" }, valor: { original: valor.toFixed(2) }, chave: chavePix, solicitacaoPagador: descricao })
    });
    if (!response.ok) throw new Error("Falha no PIX");
    const data = await response.json();
    return { txid: data.txid, status: data.status };
  }

  async processarFolhaPagamento(pagamentos: Array<{ nome: string; cpf: string; banco: string; agencia: string; conta: string; valor: number }>): Promise<{ loteId: string; quantidade: number; valorTotal: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/pagamentos/v1/lotes`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "client_id": this.config!.clientId },
      body: JSON.stringify({ numeroContrato: this.config!.numeroContrato, pagamentos: pagamentos.map(p => ({ favorecido: { nome: p.nome, cpfCnpj: p.cpf }, conta: { banco: p.banco, agencia: p.agencia, numero: p.conta }, valor: p.valor })) })
    });
    if (!response.ok) throw new Error("Falha ao processar folha");
    const data = await response.json();
    return { loteId: data.numeroLote, quantidade: pagamentos.length, valorTotal: pagamentos.reduce((s, p) => s + p.valor, 0) };
  }
}

export const sicoobService = new SicoobService();
export default sicoobService;
