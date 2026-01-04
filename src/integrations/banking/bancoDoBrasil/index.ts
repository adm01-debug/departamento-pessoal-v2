/**
 * Integração Banco do Brasil
 * API para consultas, pagamentos e transferências
 */

export interface BBConfig {
  clientId: string;
  clientSecret: string;
  certificado?: string;
  ambiente: "sandbox" | "producao";
  gw_dev_app_key?: string;
}

export interface BBContaInfo {
  agencia: string;
  conta: string;
  tipo: "corrente" | "poupanca";
  saldo?: number;
  saldoDisponivel?: number;
}

export interface BBBoleto {
  numero: string;
  codigoBarras: string;
  linhaDigitavel: string;
  valor: number;
  dataVencimento: string;
  dataEmissao: string;
  pagador: { nome: string; cpfCnpj: string; endereco: string };
  beneficiario: { nome: string; cpfCnpj: string };
  status: "pendente" | "pago" | "vencido" | "cancelado";
}

export interface BBTransferencia {
  id: string;
  tipo: "ted" | "doc" | "pix" | "interna";
  valor: number;
  dataAgendamento?: string;
  contaOrigem: BBContaInfo;
  contaDestino: { banco: string; agencia: string; conta: string; tipo: string; titular: string; cpfCnpj: string };
  descricao?: string;
  status: "pendente" | "processando" | "concluida" | "falha";
}

class BancoDoBrasilIntegration {
  private config: BBConfig | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private baseUrl: string = "";

  configure(config: BBConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" 
      ? "https://api.bb.com.br" 
      : "https://api.sandbox.bb.com.br";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.config) throw new Error("Integração não configurada");

    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`
      },
      body: "grant_type=client_credentials&scope=cobrancas.boletos-requisicao cobrancas.boletos-info"
    });

    if (!response.ok) throw new Error("Falha na autenticação BB");

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
    return this.accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "gw-dev-app-key": this.config?.gw_dev_app_key || "",
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Erro BB: ${response.status}`);
    }

    return response.json();
  }

  async consultarSaldo(agencia: string, conta: string): Promise<{ saldo: number; saldoDisponivel: number }> {
    return this.request(`/contas-correntes/v1/saldo?agencia=${agencia}&conta=${conta}`);
  }

  async consultarExtrato(agencia: string, conta: string, dataInicio: string, dataFim: string): Promise<any[]> {
    return this.request(`/contas-correntes/v1/extrato?agencia=${agencia}&conta=${conta}&dataInicioSolicitacao=${dataInicio}&dataFimSolicitacao=${dataFim}`);
  }

  async emitirBoleto(dados: {
    valor: number;
    vencimento: string;
    pagador: { nome: string; cpfCnpj: string; endereco: string; cidade: string; uf: string; cep: string };
    descricao?: string;
    multa?: number;
    juros?: number;
  }): Promise<BBBoleto> {
    const payload = {
      numeroTituloCliente: `${Date.now()}`,
      dataEmissao: new Date().toISOString().split("T")[0],
      dataVencimento: dados.vencimento,
      valorOriginal: dados.valor,
      pagador: {
        tipoInscricao: dados.pagador.cpfCnpj.length === 11 ? 1 : 2,
        numeroInscricao: dados.pagador.cpfCnpj.replace(/\D/g, ""),
        nome: dados.pagador.nome,
        endereco: dados.pagador.endereco,
        cidade: dados.pagador.cidade,
        uf: dados.pagador.uf,
        cep: dados.pagador.cep.replace(/\D/g, "")
      },
      multa: dados.multa ? { tipo: 2, valor: dados.multa } : undefined,
      jurosMora: dados.juros ? { tipo: 2, valor: dados.juros } : undefined
    };

    return this.request("/cobrancas/v2/boletos", { method: "POST", body: JSON.stringify(payload) });
  }

  async consultarBoleto(numero: string): Promise<BBBoleto> {
    return this.request(`/cobrancas/v2/boletos/${numero}`);
  }

  async cancelarBoleto(numero: string): Promise<void> {
    await this.request(`/cobrancas/v2/boletos/${numero}/baixar`, { method: "POST" });
  }

  async listarBoletos(filtros: { dataInicio: string; dataFim: string; situacao?: string }): Promise<BBBoleto[]> {
    const params = new URLSearchParams({
      dataInicioVencimento: filtros.dataInicio,
      dataFimVencimento: filtros.dataFim,
      ...(filtros.situacao && { situacaoCobranca: filtros.situacao })
    });
    const result = await this.request<{ boletos: BBBoleto[] }>(`/cobrancas/v2/boletos?${params}`);
    return result.boletos || [];
  }

  async realizarTransferencia(dados: Omit<BBTransferencia, "id" | "status">): Promise<BBTransferencia> {
    const payload = {
      tipoTransferencia: dados.tipo === "pix" ? 3 : dados.tipo === "ted" ? 1 : 2,
      valor: dados.valor,
      dataTransferencia: dados.dataAgendamento || new Date().toISOString().split("T")[0],
      descricao: dados.descricao,
      contaDebito: { agencia: dados.contaOrigem.agencia, conta: dados.contaOrigem.conta },
      contaCredito: {
        banco: dados.contaDestino.banco,
        agencia: dados.contaDestino.agencia,
        conta: dados.contaDestino.conta,
        tipoConta: dados.contaDestino.tipo === "corrente" ? 1 : 2,
        cpfCnpj: dados.contaDestino.cpfCnpj.replace(/\D/g, ""),
        nome: dados.contaDestino.titular
      }
    };

    return this.request("/transferencias/v1", { method: "POST", body: JSON.stringify(payload) });
  }

  async consultarTransferencia(id: string): Promise<BBTransferencia> {
    return this.request(`/transferencias/v1/${id}`);
  }

  async gerarPix(dados: { valor: number; descricao?: string; expiracao?: number }): Promise<{ qrcode: string; copiaCola: string; txid: string }> {
    const payload = {
      calendario: { expiracao: dados.expiracao || 3600 },
      valor: { original: dados.valor.toFixed(2) },
      infoAdicionais: dados.descricao ? [{ nome: "Descricao", valor: dados.descricao }] : []
    };

    return this.request("/pix/v1/cob", { method: "POST", body: JSON.stringify(payload) });
  }

  async consultarPix(txid: string): Promise<any> {
    return this.request(`/pix/v1/cob/${txid}`);
  }

  // Métodos para folha de pagamento
  async processarPagamentoFolha(pagamentos: Array<{
    colaborador: { nome: string; cpf: string; banco: string; agencia: string; conta: string };
    valor: number;
    competencia: string;
  }>): Promise<{ lote: string; pagamentos: Array<{ id: string; status: string }> }> {
    const loteId = `FOLHA${Date.now()}`;
    const results = [];

    for (const pag of pagamentos) {
      try {
        const result = await this.realizarTransferencia({
          tipo: "ted",
          valor: pag.valor,
          contaOrigem: { agencia: "", conta: "", tipo: "corrente" },
          contaDestino: {
            banco: pag.colaborador.banco,
            agencia: pag.colaborador.agencia,
            conta: pag.colaborador.conta,
            tipo: "corrente",
            titular: pag.colaborador.nome,
            cpfCnpj: pag.colaborador.cpf
          },
          descricao: `Salário ${pag.competencia}`
        });
        results.push({ id: result.id, status: "processando" });
      } catch {
        results.push({ id: "", status: "erro" });
      }
    }

    return { lote: loteId, pagamentos: results };
  }
}

export const bancoDoBrasil = new BancoDoBrasilIntegration();
export default bancoDoBrasil;
