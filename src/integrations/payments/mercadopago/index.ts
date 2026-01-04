/**
 * Integração Mercado Pago
 * API: https://www.mercadopago.com.br/developers
 */

export interface MercadoPagoConfig {
  accessToken: string;
  publicKey?: string;
  ambiente: "sandbox" | "producao";
}

export interface MPPagamento {
  transaction_amount: number;
  description: string;
  payment_method_id: string;
  payer: { email: string; first_name?: string; last_name?: string; identification?: { type: string; number: string } };
  installments?: number;
  token?: string;
}

class MercadoPagoService {
  private config: MercadoPagoConfig | null = null;
  private baseUrl = "https://api.mercadopago.com";

  configurar(config: MercadoPagoConfig): void {
    this.config = config;
  }

  private getHeaders(): HeadersInit {
    if (!this.config) throw new Error("Mercado Pago não configurado");
    return { "Content-Type": "application/json", "Authorization": `Bearer ${this.config.accessToken}` };
  }

  async criarPagamento(pagamento: MPPagamento): Promise<{ id: string; status: string; status_detail: string }> {
    const response = await fetch(`${this.baseUrl}/v1/payments`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(pagamento)
    });
    if (!response.ok) throw new Error("Falha ao criar pagamento");
    return response.json();
  }

  async consultarPagamento(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/v1/payments/${id}`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error("Falha ao consultar pagamento");
    return response.json();
  }

  async gerarBoleto(valor: number, email: string, nome: string, cpf: string, descricao: string): Promise<{ id: string; barcode: string; external_resource_url: string }> {
    const pagamento: MPPagamento = {
      transaction_amount: valor,
      description: descricao,
      payment_method_id: "bolbradesco",
      payer: { email, first_name: nome.split(" ")[0], last_name: nome.split(" ").slice(1).join(" "), identification: { type: "CPF", number: cpf } }
    };
    const result = await this.criarPagamento(pagamento);
    return { id: result.id, barcode: (result as any).barcode?.content || "", external_resource_url: (result as any).transaction_details?.external_resource_url || "" };
  }

  async gerarPixCobranca(valor: number, email: string, descricao: string): Promise<{ id: string; qr_code: string; qr_code_base64: string }> {
    const pagamento: MPPagamento = { transaction_amount: valor, description: descricao, payment_method_id: "pix", payer: { email } };
    const result = await this.criarPagamento(pagamento);
    const pointOfInteraction = (result as any).point_of_interaction?.transaction_data || {};
    return { id: result.id, qr_code: pointOfInteraction.qr_code || "", qr_code_base64: pointOfInteraction.qr_code_base64 || "" };
  }

  async criarPreferencia(itens: Array<{ title: string; quantity: number; unit_price: number }>, pagador?: { name: string; email: string }): Promise<{ id: string; init_point: string; sandbox_init_point: string }> {
    const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ items: itens, payer: pagador })
    });
    if (!response.ok) throw new Error("Falha ao criar preferência");
    return response.json();
  }

  async consultarSaldo(): Promise<{ available_balance: number; total_amount: number }> {
    const response = await fetch(`${this.baseUrl}/users/me`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error("Falha ao consultar dados");
    const userData = await response.json();
    return { available_balance: userData.available_balance || 0, total_amount: userData.total_amount || 0 };
  }

  async realizarSaque(valor: number): Promise<{ id: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/v1/account/bank_report/schedule`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ amount: valor })
    });
    if (!response.ok) throw new Error("Falha no saque");
    return response.json();
  }

  async listarPagamentos(filtros?: { begin_date?: string; end_date?: string; status?: string }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filtros?.begin_date) params.append("begin_date", filtros.begin_date);
    if (filtros?.end_date) params.append("end_date", filtros.end_date);
    if (filtros?.status) params.append("status", filtros.status);
    const response = await fetch(`${this.baseUrl}/v1/payments/search?${params}`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error("Falha ao listar pagamentos");
    const data = await response.json();
    return data.results || [];
  }

  async estornarPagamento(id: string): Promise<{ id: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/v1/payments/${id}/refunds`, {
      method: "POST",
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error("Falha no estorno");
    return response.json();
  }
}

export const mercadoPagoService = new MercadoPagoService();
export default mercadoPagoService;
