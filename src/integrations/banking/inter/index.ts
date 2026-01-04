/**
 * Integração Banco Inter
 * API completa para boletos, PIX e pagamentos
 */

export interface InterConfig {
  clientId: string;
  clientSecret: string;
  certificado: string;
  chavePrivada: string;
  contaCorrente: string;
  ambiente: "sandbox" | "producao";
}

export interface InterBoleto {
  codigoSolicitacao: string;
  nossoNumero: string;
  codigoBarras: string;
  linhaDigitavel: string;
  valor: number;
  dataVencimento: string;
  situacao: "EMITIDO" | "PAGO" | "CANCELADO" | "EXPIRADO";
}

export interface InterPix {
  txid: string;
  pixCopiaECola: string;
  qrcode: string;
  valor: number;
  status: "ATIVA" | "CONCLUIDA" | "REMOVIDA_PELO_USUARIO_RECEBEDOR";
}

class InterIntegration {
  private config: InterConfig | null = null;
  private accessToken: string | null = null;
  private baseUrl: string = "";

  configure(config: InterConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://cdpj.partners.bancointer.com.br" : "https://cdpj-sandbox.partners.bancointer.com.br";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    if (!this.config) throw new Error("Integração não configurada");
    const response = await fetch(`${this.baseUrl}/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&scope=boleto-cobranca.read boleto-cobranca.write pix.read pix.write`
    });
    if (!response.ok) throw new Error("Falha na autenticação Inter");
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
    if (!response.ok) throw new Error(`Erro Inter: ${response.status}`);
    return response.json();
  }

  async consultarSaldo(): Promise<{ disponivel: number; bloqueadoCheque: number; bloqueadoJudicial: number; total: number }> {
    return this.request("/banking/v2/saldo");
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<any[]> {
    return this.request(`/banking/v2/extrato?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  async emitirBoleto(dados: { valor: number; vencimento: string; numDiasAgenda?: number; pagador: { nome: string; cpfCnpj: string; email?: string; endereco: string; cidade: string; uf: string; cep: string } }): Promise<InterBoleto> {
    return this.request("/cobranca/v3/cobrancas", {
      method: "POST",
      body: JSON.stringify({
        seuNumero: `${Date.now()}`,
        valorNominal: dados.valor,
        dataVencimento: dados.vencimento,
        numDiasAgenda: dados.numDiasAgenda || 60,
        pagador: { cpfCnpj: dados.pagador.cpfCnpj.replace(/\D/g, ""), tipoPessoa: dados.pagador.cpfCnpj.length === 11 ? "FISICA" : "JURIDICA", nome: dados.pagador.nome, email: dados.pagador.email, endereco: dados.pagador.endereco, cidade: dados.pagador.cidade, uf: dados.pagador.uf, cep: dados.pagador.cep.replace(/\D/g, "") }
      })
    });
  }

  async consultarBoleto(codigoSolicitacao: string): Promise<InterBoleto> {
    return this.request(`/cobranca/v3/cobrancas/${codigoSolicitacao}`);
  }

  async cancelarBoleto(codigoSolicitacao: string, motivo: string): Promise<void> {
    await this.request(`/cobranca/v3/cobrancas/${codigoSolicitacao}/cancelar`, { method: "POST", body: JSON.stringify({ motivoCancelamento: motivo }) });
  }

  async gerarPixCobranca(dados: { valor: number; descricao?: string; expiracaoSegundos?: number; devedor?: { nome: string; cpf: string } }): Promise<InterPix> {
    return this.request("/pix/v2/cob", {
      method: "POST",
      body: JSON.stringify({
        calendario: { expiracao: dados.expiracaoSegundos || 3600 },
        valor: { original: dados.valor.toFixed(2) },
        infoAdicionais: dados.descricao ? [{ nome: "Descricao", valor: dados.descricao }] : [],
        devedor: dados.devedor ? { cpf: dados.devedor.cpf.replace(/\D/g, ""), nome: dados.devedor.nome } : undefined
      })
    });
  }

  async consultarPix(txid: string): Promise<InterPix> {
    return this.request(`/pix/v2/cob/${txid}`);
  }

  async realizarPixPagamento(dados: { chave: string; valor: number; descricao?: string }): Promise<{ endToEndId: string; status: string }> {
    return this.request("/pix/v2/pix", {
      method: "POST",
      body: JSON.stringify({ valor: dados.valor.toFixed(2), destinatario: { tipo: "CHAVE", chave: dados.chave }, descricao: dados.descricao })
    });
  }

  async realizarTED(dados: { valor: number; favorecido: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string; tipoConta: string } }): Promise<{ codigoTransacao: string; status: string }> {
    return this.request("/banking/v2/ted", {
      method: "POST",
      body: JSON.stringify({
        valor: dados.valor,
        contaDestino: { banco: dados.favorecido.banco, agencia: dados.favorecido.agencia, conta: dados.favorecido.conta, tipoConta: dados.favorecido.tipoConta },
        favorecido: { nome: dados.favorecido.nome, cpfCnpj: dados.favorecido.cpfCnpj.replace(/\D/g, "") }
      })
    });
  }

  async processarFolhaPagamento(pagamentos: Array<{ colaborador: { nome: string; cpf: string; chavePix?: string; banco?: string; agencia?: string; conta?: string }; valor: number }>): Promise<{ lote: string; resultados: Array<{ status: string }> }> {
    const loteId = `FOLHA_INTER_${Date.now()}`;
    const resultados = [];
    for (const pag of pagamentos) {
      try {
        if (pag.colaborador.chavePix) {
          await this.realizarPixPagamento({ chave: pag.colaborador.chavePix, valor: pag.valor, descricao: "Pagamento de salário" });
        } else if (pag.colaborador.banco) {
          await this.realizarTED({ valor: pag.valor, favorecido: { nome: pag.colaborador.nome, cpfCnpj: pag.colaborador.cpf, banco: pag.colaborador.banco!, agencia: pag.colaborador.agencia!, conta: pag.colaborador.conta!, tipoConta: "CORRENTE" } });
        }
        resultados.push({ status: "sucesso" });
      } catch { resultados.push({ status: "erro" }); }
    }
    return { lote: loteId, resultados };
  }
}

export const inter = new InterIntegration();
export default inter;
