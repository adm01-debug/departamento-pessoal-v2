/**
 * Integração PagSeguro / PagBank
 * API: https://dev.pagbank.uol.com.br
 */

export interface PagSeguroConfig {
  token: string;
  ambiente: "sandbox" | "producao";
}

export interface PSPagamento {
  reference_id: string;
  customer: { name: string; email: string; tax_id: string; phones?: Array<{ country: string; area: string; number: string }> };
  items: Array<{ reference_id: string; name: string; quantity: number; unit_amount: number }>;
  shipping?: { address: { street: string; number: string; locality: string; city: string; region_code: string; country: string; postal_code: string } };
  notification_urls?: string[];
}

class PagSeguroService {
  private config: PagSeguroConfig | null = null;
  private baseUrl = "";

  configurar(config: PagSeguroConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.pagseguro.com" : "https://sandbox.api.pagseguro.com";
  }

  private getHeaders(): HeadersInit {
    if (!this.config) throw new Error("PagSeguro não configurado");
    return { "Content-Type": "application/json", "Authorization": `Bearer ${this.config.token}` };
  }

  async criarPedido(pedido: PSPagamento): Promise<{ id: string; status: string; links: any[] }> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(pedido)
    });
    if (!response.ok) throw new Error("Falha ao criar pedido");
    return response.json();
  }

  async consultarPedido(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/orders/${id}`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error("Falha ao consultar pedido");
    return response.json();
  }

  async gerarBoleto(dados: { valor: number; vencimento: string; cliente: { nome: string; email: string; cpf: string }; descricao: string }): Promise<{ id: string; barcode: string; formatted_barcode: string; due_date: string }> {
    const pedido: PSPagamento = {
      reference_id: `BOL_${Date.now()}`,
      customer: { name: dados.cliente.nome, email: dados.cliente.email, tax_id: dados.cliente.cpf },
      items: [{ reference_id: "item1", name: dados.descricao, quantity: 1, unit_amount: Math.round(dados.valor * 100) }]
    };
    const order = await this.criarPedido(pedido);
    
    const response = await fetch(`${this.baseUrl}/orders/${order.id}/pay`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ charges: [{ reference_id: "charge1", amount: { value: Math.round(dados.valor * 100), currency: "BRL" }, payment_method: { type: "BOLETO", boleto: { due_date: dados.vencimento, instruction_lines: { line_1: dados.descricao }, holder: { name: dados.cliente.nome, tax_id: dados.cliente.cpf, email: dados.cliente.email } } } }] })
    });
    if (!response.ok) throw new Error("Falha ao gerar boleto");
    const result = await response.json();
    const boleto = result.charges?.[0]?.payment_method?.boleto || {};
    return { id: order.id, barcode: boleto.barcode || "", formatted_barcode: boleto.formatted_barcode || "", due_date: boleto.due_date || dados.vencimento };
  }

  async gerarPixCobranca(valor: number, cliente: { nome: string; email: string; cpf: string }, descricao: string): Promise<{ id: string; qr_codes: Array<{ id: string; text: string }> }> {
    const pedido: PSPagamento = {
      reference_id: `PIX_${Date.now()}`,
      customer: { name: cliente.nome, email: cliente.email, tax_id: cliente.cpf },
      items: [{ reference_id: "item1", name: descricao, quantity: 1, unit_amount: Math.round(valor * 100) }]
    };
    const order = await this.criarPedido(pedido);
    
    const response = await fetch(`${this.baseUrl}/orders/${order.id}/pay`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ qr_codes: [{ amount: { value: Math.round(valor * 100) }, expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }] })
    });
    if (!response.ok) throw new Error("Falha ao gerar PIX");
    const result = await response.json();
    return { id: order.id, qr_codes: result.qr_codes || [] };
  }

  async consultarSaldo(): Promise<{ available: { amount: number }; blocked: { amount: number } }> {
    const response = await fetch(`${this.baseUrl}/balance`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error("Falha ao consultar saldo");
    return response.json();
  }

  async realizarTransferencia(valor: number, banco: string, agencia: string, conta: string, tipoConta: string, cpfCnpj: string, nome: string): Promise<{ id: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/transfers`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ reference_id: `TRF_${Date.now()}`, amount: { value: Math.round(valor * 100), currency: "BRL" }, receiver: { name: nome, tax_id: cpfCnpj, bank_account: { bank: banco, agency: agencia, number: conta, type: tipoConta } } })
    });
    if (!response.ok) throw new Error("Falha na transferência");
    return response.json();
  }

  async listarTransacoes(filtros?: { reference_id?: string; status?: string }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filtros?.reference_id) params.append("reference_id", filtros.reference_id);
    if (filtros?.status) params.append("status", filtros.status);
    const response = await fetch(`${this.baseUrl}/orders?${params}`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error("Falha ao listar transações");
    const data = await response.json();
    return data.orders || [];
  }

  async estornarPagamento(chargeId: string, valor?: number): Promise<{ id: string; status: string }> {
    const body = valor ? { amount: { value: Math.round(valor * 100) } } : {};
    const response = await fetch(`${this.baseUrl}/charges/${chargeId}/cancel`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error("Falha no estorno");
    return response.json();
  }
}

export const pagSeguroService = new PagSeguroService();
export default pagSeguroService;
