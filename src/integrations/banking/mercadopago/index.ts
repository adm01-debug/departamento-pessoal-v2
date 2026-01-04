/**
 * Integração Mercado Pago
 * API para pagamentos, cobranças e transferências
 */

export interface MercadoPagoConfig {
  accessToken: string;
  publicKey?: string;
  ambiente: "sandbox" | "producao";
}

export interface MPPagamento {
  id: number;
  status: "pending" | "approved" | "authorized" | "in_process" | "in_mediation" | "rejected" | "cancelled" | "refunded" | "charged_back";
  status_detail: string;
  transaction_amount: number;
  net_received_amount: number;
  date_created: string;
  date_approved?: string;
  payment_method_id: string;
  payment_type_id: string;
  point_of_interaction?: { transaction_data?: { qr_code: string; qr_code_base64: string } };
}

export interface MPPreferencia {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

class MercadoPagoIntegration {
  private config: MercadoPagoConfig | null = null;
  private baseUrl = "https://api.mercadopago.com";

  configure(config: MercadoPagoConfig): void {
    this.config = config;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.config) throw new Error("Integração não configurada");
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { "Authorization": `Bearer ${this.config.accessToken}`, "Content-Type": "application/json", ...options.headers }
    });
    if (!response.ok) throw new Error(`Erro Mercado Pago: ${response.status}`);
    return response.json();
  }

  // Pagamentos
  async criarPagamentoPix(dados: { valor: number; descricao: string; email: string; identificador?: string }): Promise<MPPagamento> {
    return this.request("/v1/payments", {
      method: "POST",
      body: JSON.stringify({
        transaction_amount: dados.valor,
        description: dados.descricao,
        payment_method_id: "pix",
        payer: { email: dados.email },
        external_reference: dados.identificador
      })
    });
  }

  async criarPagamentoBoleto(dados: { valor: number; descricao: string; pagador: { nome: string; email: string; cpf: string; endereco: string; cep: string }; vencimento: string }): Promise<MPPagamento> {
    return this.request("/v1/payments", {
      method: "POST",
      body: JSON.stringify({
        transaction_amount: dados.valor,
        description: dados.descricao,
        payment_method_id: "bolbradesco",
        date_of_expiration: dados.vencimento,
        payer: { email: dados.pagador.email, first_name: dados.pagador.nome.split(" ")[0], last_name: dados.pagador.nome.split(" ").slice(1).join(" "), identification: { type: "CPF", number: dados.pagador.cpf.replace(/\D/g, "") }, address: { zip_code: dados.pagador.cep, street_name: dados.pagador.endereco } }
      })
    });
  }

  async buscarPagamento(id: number): Promise<MPPagamento> {
    return this.request(`/v1/payments/${id}`);
  }

  async listarPagamentos(filtros?: { status?: string; external_reference?: string }): Promise<MPPagamento[]> {
    const params = new URLSearchParams();
    if (filtros?.status) params.append("status", filtros.status);
    if (filtros?.external_reference) params.append("external_reference", filtros.external_reference);
    const result = await this.request<{ results: MPPagamento[] }>(`/v1/payments/search?${params}`);
    return result.results;
  }

  async cancelarPagamento(id: number): Promise<MPPagamento> {
    return this.request(`/v1/payments/${id}`, { method: "PUT", body: JSON.stringify({ status: "cancelled" }) });
  }

  async reembolsarPagamento(id: number, valor?: number): Promise<any> {
    return this.request(`/v1/payments/${id}/refunds`, { method: "POST", body: JSON.stringify(valor ? { amount: valor } : {}) });
  }

  // Preferências (Checkout Pro)
  async criarPreferencia(dados: { items: Array<{ title: string; quantity: number; unit_price: number }>; payer?: { email: string }; external_reference?: string; back_urls?: { success: string; failure: string; pending: string } }): Promise<MPPreferencia> {
    return this.request("/checkout/preferences", { method: "POST", body: JSON.stringify(dados) });
  }

  // Saldo
  async consultarSaldo(): Promise<{ available_balance: number; total_amount: number }> {
    return this.request("/users/me/mercadopago_account/balance");
  }

  // Transferências
  async realizarTransferencia(dados: { valor: number; userId: number }): Promise<{ id: number; status: string }> {
    return this.request("/v1/account/bank_report/schedule", { method: "POST", body: JSON.stringify({ user_id: dados.userId, amount: dados.valor }) });
  }

  // Folha de Pagamento (via PIX)
  async processarFolhaPagamento(pagamentos: Array<{ colaborador: { nome: string; email: string; cpf: string; chavePix?: string }; valor: number }>): Promise<{ lote: string; resultados: Array<{ id: number; status: string }> }> {
    const loteId = `FOLHA_MP_${Date.now()}`;
    const resultados = [];

    for (const pag of pagamentos) {
      try {
        const result = await this.criarPagamentoPix({ valor: pag.valor, descricao: `Salário - ${pag.colaborador.nome}`, email: pag.colaborador.email, identificador: `FOLHA_${pag.colaborador.cpf}` });
        resultados.push({ id: result.id, status: result.status });
      } catch {
        resultados.push({ id: 0, status: "error" });
      }
    }

    return { lote: loteId, resultados };
  }

  // Webhooks
  async validarWebhook(xSignature: string, xRequestId: string, dataId: string, secret: string): Promise<boolean> {
    const crypto = await import("crypto");
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${xSignature.split(",")[0].split("ts=")[1]};`;
    const hmac = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
    return xSignature.includes(hmac);
  }
}

export const mercadopago = new MercadoPagoIntegration();
export default mercadopago;
