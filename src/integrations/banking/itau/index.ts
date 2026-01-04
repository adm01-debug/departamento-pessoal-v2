/**
 * Integração Itaú Unibanco
 * API Itaú para consultas, boletos e transferências
 */

export interface ItauConfig {
  clientId: string;
  clientSecret: string;
  certificadoPfx?: Buffer;
  senhaCertificado?: string;
  ambiente: "sandbox" | "producao";
}

export interface ItauBoleto {
  nossoNumero: string;
  seuNumero: string;
  codigoBarras: string;
  linhaDigitavel: string;
  valor: number;
  valorDesconto?: number;
  valorMulta?: number;
  valorJuros?: number;
  dataEmissao: string;
  dataVencimento: string;
  pagador: { nome: string; documento: string; endereco: string };
  situacao: "ABERTO" | "PAGO" | "VENCIDO" | "BAIXADO";
}

export interface ItauTransferencia {
  id: string;
  tipo: "TED" | "DOC" | "PIX" | "INTERNA";
  valor: number;
  dataEfetivacao?: string;
  favorecido: { nome: string; documento: string; banco: string; agencia: string; conta: string };
  status: "PENDENTE" | "PROCESSANDO" | "EFETIVADA" | "REJEITADA";
}

class ItauIntegration {
  private config: ItauConfig | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private baseUrl: string = "";

  configure(config: ItauConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" 
      ? "https://api.itau.com.br" 
      : "https://api.sandbox.itau.com.br";
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
      body: "grant_type=client_credentials"
    });

    if (!response.ok) throw new Error("Falha na autenticação Itaú");
    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
    return this.accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", ...options.headers }
    });
    if (!response.ok) throw new Error(`Erro Itaú: ${response.status}`);
    return response.json();
  }

  async consultarSaldo(agencia: string, conta: string): Promise<{ saldo: number; limite: number }> {
    return this.request(`/contas/v1/${agencia}/${conta}/saldo`);
  }

  async consultarExtrato(agencia: string, conta: string, dataInicio: string, dataFim: string): Promise<any[]> {
    return this.request(`/contas/v1/${agencia}/${conta}/extrato?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  async emitirBoleto(dados: {
    valor: number;
    vencimento: string;
    pagador: { nome: string; documento: string; endereco: string };
    instrucoes?: string[];
  }): Promise<ItauBoleto> {
    const payload = {
      tipo_ambiente: this.config?.ambiente === "producao" ? "1" : "2",
      dado_boleto: {
        tipo_boleto: "a vista",
        valor_total_titulo: dados.valor.toFixed(2),
        data_vencimento: dados.vencimento,
        pagador: {
          pessoa: { nome_pessoa: dados.pagador.nome, tipo_pessoa: { codigo_tipo_pessoa: dados.pagador.documento.length === 11 ? "F" : "J", numero_cadastro_pessoa_fisica: dados.pagador.documento } },
          endereco: { nome_logradouro: dados.pagador.endereco }
        }
      }
    };
    return this.request("/boletos/v2/boletos", { method: "POST", body: JSON.stringify(payload) });
  }

  async consultarBoleto(nossoNumero: string): Promise<ItauBoleto> {
    return this.request(`/boletos/v2/boletos/${nossoNumero}`);
  }

  async baixarBoleto(nossoNumero: string, motivo: string): Promise<void> {
    await this.request(`/boletos/v2/boletos/${nossoNumero}/baixa`, { method: "PATCH", body: JSON.stringify({ codigo_motivo_baixa: motivo }) });
  }

  async realizarTransferencia(dados: {
    tipo: "TED" | "PIX";
    valor: number;
    favorecido: { nome: string; documento: string; banco: string; agencia: string; conta: string };
    dataAgendamento?: string;
  }): Promise<ItauTransferencia> {
    const payload = {
      tipo_transferencia: dados.tipo,
      valor: dados.valor,
      data_pagamento: dados.dataAgendamento || new Date().toISOString().split("T")[0],
      favorecido: {
        nome: dados.favorecido.nome,
        documento: dados.favorecido.documento,
        banco: dados.favorecido.banco,
        agencia: dados.favorecido.agencia,
        conta: dados.favorecido.conta
      }
    };
    return this.request("/transferencias/v1", { method: "POST", body: JSON.stringify(payload) });
  }

  async gerarPixCobranca(dados: { valor: number; descricao?: string; expiracao?: number }): Promise<{ qrcode: string; txid: string }> {
    return this.request("/pix/v2/cob", { method: "POST", body: JSON.stringify({ valor: { original: dados.valor.toFixed(2) }, calendario: { expiracao: dados.expiracao || 3600 } }) });
  }

  async consultarPix(txid: string): Promise<any> {
    return this.request(`/pix/v2/cob/${txid}`);
  }

  async processarFolhaPagamento(pagamentos: Array<{ colaborador: { nome: string; cpf: string; banco: string; agencia: string; conta: string }; valor: number; competencia: string }>): Promise<{ lote: string; status: string }> {
    const loteId = `FOLHA_ITAU_${Date.now()}`;
    for (const pag of pagamentos) {
      await this.realizarTransferencia({
        tipo: "TED",
        valor: pag.valor,
        favorecido: { nome: pag.colaborador.nome, documento: pag.colaborador.cpf, banco: pag.colaborador.banco, agencia: pag.colaborador.agencia, conta: pag.colaborador.conta }
      });
    }
    return { lote: loteId, status: "processando" };
  }
}

export const itau = new ItauIntegration();
export default itau;
