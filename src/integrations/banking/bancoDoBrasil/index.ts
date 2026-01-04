/**
 * Integração Banco do Brasil
 * API: https://developers.bb.com.br
 * Funcionalidades: Pagamentos, Cobranças, Pix, Consulta Saldo/Extrato
 */

export interface BBConfig {
  clientId: string;
  clientSecret: string;
  developerKey: string;
  ambiente: "sandbox" | "producao";
  certificado?: string;
  agencia: string;
  conta: string;
}

export interface BBToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface BBPagamento {
  id?: string;
  tipo: "transferencia" | "boleto" | "pix" | "folha";
  valor: number;
  dataVencimento: string;
  beneficiario: {
    nome: string;
    cpfCnpj: string;
    banco?: string;
    agencia?: string;
    conta?: string;
    tipoConta?: "corrente" | "poupanca";
    chavePix?: string;
  };
  descricao?: string;
  codigoBarras?: string;
}

export interface BBExtrato {
  dataInicio: string;
  dataFim: string;
  saldoInicial: number;
  saldoFinal: number;
  lancamentos: {
    data: string;
    descricao: string;
    valor: number;
    tipo: "credito" | "debito";
    documento?: string;
  }[];
}

class BancoDoBrasilService {
  private config: BBConfig | null = null;
  private token: BBToken | null = null;
  private tokenExpiry: Date | null = null;
  private baseUrl = "";

  configurar(config: BBConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" 
      ? "https://api.bb.com.br" 
      : "https://api.sandbox.bb.com.br";
  }

  private async obterToken(): Promise<string> {
    if (!this.config) throw new Error("Banco do Brasil não configurado");
    
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.token.access_token;
    }

    const credentials = btoa(`${this.config.clientId}:${this.config.clientSecret}`);
    
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials&scope=cobrancas.boletos-info cobrancas.boletos-requisicao pagamentos-lote pagamentos-info"
    });

    if (!response.ok) throw new Error("Falha na autenticação BB");

    this.token = await response.json();
    this.tokenExpiry = new Date(Date.now() + (this.token!.expires_in - 60) * 1000);
    
    return this.token!.access_token;
  }

  async consultarSaldo(): Promise<{ disponivel: number; bloqueado: number; limite: number }> {
    const token = await this.obterToken();
    
    const response = await fetch(
      `${this.baseUrl}/contas-correntes/${this.config!.agencia}/${this.config!.conta}/saldo?gw-dev-app-key=${this.config!.developerKey}`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    if (!response.ok) throw new Error("Falha ao consultar saldo");
    
    const data = await response.json();
    return {
      disponivel: data.saldoDisponivel || 0,
      bloqueado: data.saldoBloqueado || 0,
      limite: data.limiteCredito || 0
    };
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<BBExtrato> {
    const token = await this.obterToken();
    
    const response = await fetch(
      `${this.baseUrl}/contas-correntes/${this.config!.agencia}/${this.config!.conta}/extrato?gw-dev-app-key=${this.config!.developerKey}&dataInicioSolicitacao=${dataInicio}&dataFimSolicitacao=${dataFim}`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    if (!response.ok) throw new Error("Falha ao consultar extrato");
    
    const data = await response.json();
    return {
      dataInicio,
      dataFim,
      saldoInicial: data.saldoInicial || 0,
      saldoFinal: data.saldoFinal || 0,
      lancamentos: (data.lancamentos || []).map((l: any) => ({
        data: l.dataLancamento,
        descricao: l.descricaoLancamento,
        valor: l.valorLancamento,
        tipo: l.indicadorSinal === "C" ? "credito" : "debito",
        documento: l.numeroDocumento
      }))
    };
  }

  async gerarBoleto(dados: {
    valor: number;
    vencimento: string;
    pagador: { nome: string; cpfCnpj: string; endereco: string };
    descricao?: string;
  }): Promise<{ codigoBarras: string; linhaDigitavel: string; urlBoleto: string }> {
    const token = await this.obterToken();
    
    const body = {
      numeroConvenio: this.config!.conta,
      dataVencimento: dados.vencimento.replace(/-/g, "."),
      valorOriginal: dados.valor,
      descricaoTipoTitulo: "DM",
      pagador: {
        tipoInscricao: dados.pagador.cpfCnpj.length === 11 ? 1 : 2,
        numeroInscricao: dados.pagador.cpfCnpj,
        nome: dados.pagador.nome,
        endereco: dados.pagador.endereco
      }
    };

    const response = await fetch(
      `${this.baseUrl}/cobrancas/v2/boletos?gw-dev-app-key=${this.config!.developerKey}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) throw new Error("Falha ao gerar boleto");
    
    const data = await response.json();
    return {
      codigoBarras: data.codigoBarraNumerico,
      linhaDigitavel: data.linhaDigitavel,
      urlBoleto: data.urlBoleto || ""
    };
  }

  async realizarTransferencia(pagamento: BBPagamento): Promise<{ protocolo: string; status: string }> {
    const token = await this.obterToken();
    
    const body = {
      numeroRequisicao: Date.now(),
      agenciaDebito: this.config!.agencia,
      contaCorrenteDebito: this.config!.conta,
      digitoVerificadorContaDebito: "0",
      tipoPagamento: pagamento.tipo === "pix" ? 128 : 1,
      dataTransferencia: pagamento.dataVencimento.replace(/-/g, ""),
      valorTransferencia: pagamento.valor,
      documentoDebito: pagamento.descricao?.substring(0, 20) || "PAGAMENTO",
      codigoFinalidadeTED: "10",
      numeroAgenciaCredito: pagamento.beneficiario.agencia,
      numeroContaCredito: pagamento.beneficiario.conta,
      digitoVerificadorContaCredito: "0",
      codigoBancoCredito: pagamento.beneficiario.banco,
      nomeFavorecido: pagamento.beneficiario.nome,
      documentoFavorecido: pagamento.beneficiario.cpfCnpj
    };

    const response = await fetch(
      `${this.baseUrl}/pagamentos-lote/v1/transferencias?gw-dev-app-key=${this.config!.developerKey}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) throw new Error("Falha na transferência");
    
    const data = await response.json();
    return {
      protocolo: data.numeroProtocolo || data.id,
      status: data.situacao || "PENDENTE"
    };
  }

  async realizarPix(chavePix: string, valor: number, descricao?: string): Promise<{ txid: string; status: string }> {
    const token = await this.obterToken();
    
    const body = {
      valor: { original: valor.toFixed(2) },
      chave: chavePix,
      solicitacaoPagador: descricao || "Pagamento via PIX"
    };

    const response = await fetch(
      `${this.baseUrl}/pix/v1/cob?gw-dev-app-key=${this.config!.developerKey}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) throw new Error("Falha no PIX");
    
    const data = await response.json();
    return { txid: data.txid, status: data.status };
  }

  async processarFolhaPagamento(pagamentos: Array<{
    colaboradorId: string;
    nome: string;
    cpf: string;
    banco: string;
    agencia: string;
    conta: string;
    valor: number;
  }>): Promise<{ loteId: string; quantidade: number; valorTotal: number }> {
    const token = await this.obterToken();
    
    const lancamentos = pagamentos.map((p, index) => ({
      numeroDocumentoDebito: index + 1,
      dataTransferencia: new Date().toISOString().split("T")[0].replace(/-/g, ""),
      valorTransferencia: p.valor,
      codigoBancoCredito: p.banco,
      agenciaCredito: p.agencia,
      contaCorrenteCredito: p.conta,
      nomeFavorecido: p.nome,
      documentoFavorecido: p.cpf,
      descricaoTransferencia: "PAGAMENTO SALARIO"
    }));

    const body = {
      numeroRequisicao: Date.now(),
      numeroContrato: this.config!.conta,
      agenciaDebito: this.config!.agencia,
      contaCorrenteDebito: this.config!.conta,
      lancamentos
    };

    const response = await fetch(
      `${this.baseUrl}/pagamentos-lote/v1/lotes?gw-dev-app-key=${this.config!.developerKey}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) throw new Error("Falha ao processar folha");
    
    const data = await response.json();
    return {
      loteId: data.numeroLote || data.id,
      quantidade: pagamentos.length,
      valorTotal: pagamentos.reduce((sum, p) => sum + p.valor, 0)
    };
  }

  async consultarStatusLote(loteId: string): Promise<{ status: string; pagamentosProcessados: number; pagamentosComErro: number }> {
    const token = await this.obterToken();
    
    const response = await fetch(
      `${this.baseUrl}/pagamentos-lote/v1/lotes/${loteId}?gw-dev-app-key=${this.config!.developerKey}`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    if (!response.ok) throw new Error("Falha ao consultar lote");
    
    const data = await response.json();
    return {
      status: data.situacaoLote,
      pagamentosProcessados: data.quantidadePagamentosProcessados || 0,
      pagamentosComErro: data.quantidadePagamentosComErro || 0
    };
  }
}

export const bancoDoBrasilService = new BancoDoBrasilService();
export default bancoDoBrasilService;
