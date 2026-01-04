/**
 * Integração Banco Inter
 * API: https://developers.inter.co
 */

export interface InterConfig {
  clientId: string;
  clientSecret: string;
  certificado: string;
  chaveCertificado: string;
  ambiente: "sandbox" | "producao";
  contaCorrente: string;
}

class InterService {
  private config: InterConfig | null = null;
  private token: string | null = null;
  private baseUrl = "";

  configurar(config: InterConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://cdpj.partners.bancointer.com.br" : "https://cdpj-sandbox.partners.bancointer.com.br";
  }

  private async obterToken(): Promise<string> {
    if (!this.config) throw new Error("Inter não configurado");
    if (this.token) return this.token;
    const response = await fetch(`${this.baseUrl}/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&scope=extrato.read boleto-cobranca.read boleto-cobranca.write pagamento-boleto.read pagamento-boleto.write pix.read pix.write&grant_type=client_credentials`
    });
    if (!response.ok) throw new Error("Falha na autenticação Inter");
    const data = await response.json();
    this.token = data.access_token;
    return this.token!;
  }

  async consultarSaldo(): Promise<{ disponivel: number; bloqueadoCheque: number; bloqueadoJudicial: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/banking/v2/saldo`, { headers: { "Authorization": `Bearer ${token}` } });
    if (!response.ok) throw new Error("Falha ao consultar saldo");
    const data = await response.json();
    return { disponivel: data.disponivel || 0, bloqueadoCheque: data.bloqueadoCheque || 0, bloqueadoJudicial: data.bloqueadoJudicial || 0 };
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<{ transacoes: any[] }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/banking/v2/extrato?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Falha ao consultar extrato");
    return response.json();
  }

  async gerarBoleto(dados: { valor: number; vencimento: string; pagador: { nome: string; cpfCnpj: string; endereco: string; cidade: string; uf: string; cep: string } }): Promise<{ nossoNumero: string; codigoBarras: string; linhaDigitavel: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/cobranca/v3/cobrancas`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ seuNumero: Date.now().toString(), valorNominal: dados.valor, dataVencimento: dados.vencimento, pagador: dados.pagador })
    });
    if (!response.ok) throw new Error("Falha ao gerar boleto");
    return response.json();
  }

  async realizarPix(chavePix: string, valor: number, descricao?: string): Promise<{ endToEndId: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/banking/v2/pix`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ chave: chavePix, valor, descricao })
    });
    if (!response.ok) throw new Error("Falha no PIX");
    const data = await response.json();
    return { endToEndId: data.endToEndId, status: data.status };
  }

  async pagarBoleto(codigoBarras: string, valor: number, dataVencimento: string): Promise<{ codigoTransacao: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/banking/v2/pagamento`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ codBarraLinhaDigitavel: codigoBarras, valorPagar: valor, dataPagamento: dataVencimento })
    });
    if (!response.ok) throw new Error("Falha ao pagar boleto");
    const data = await response.json();
    return { codigoTransacao: data.codigoTransacao, status: data.statusPagamento };
  }

  async processarFolhaPagamento(pagamentos: Array<{ nome: string; cpf: string; banco: string; agencia: string; conta: string; valor: number }>): Promise<{ loteId: string; quantidade: number; valorTotal: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/banking/v2/pagamento/lote`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ meuIdentificador: `FOLHA_${Date.now()}`, pagamentos: pagamentos.map(p => ({ tipo: "TED", nome: p.nome, cpfCnpj: p.cpf, banco: p.banco, agencia: p.agencia, conta: p.conta, valor: p.valor })) })
    });
    if (!response.ok) throw new Error("Falha ao processar folha");
    const data = await response.json();
    return { loteId: data.idLote || data.meuIdentificador, quantidade: pagamentos.length, valorTotal: pagamentos.reduce((s, p) => s + p.valor, 0) };
  }
}

export const interService = new InterService();
export default interService;
