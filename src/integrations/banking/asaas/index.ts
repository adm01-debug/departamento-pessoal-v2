/**
 * Integração Asaas
 * Plataforma completa de cobranças, boletos, PIX e transferências
 */

export interface AsaasConfig {
  apiKey: string;
  ambiente: "sandbox" | "producao";
  walletId?: string;
}

export interface AsaasCliente {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  province?: string;
  postalCode?: string;
}

export interface AsaasCobranca {
  id: string;
  customer: string;
  value: number;
  netValue: number;
  billingType: "BOLETO" | "PIX" | "CREDIT_CARD" | "UNDEFINED";
  status: "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE" | "REFUNDED" | "RECEIVED_IN_CASH" | "REFUND_REQUESTED";
  dueDate: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  invoiceNumber?: string;
  pixQrCodeId?: string;
  pixCopiaECola?: string;
}

export interface AsaasTransferencia {
  id: string;
  value: number;
  netValue: number;
  status: "PENDING" | "BANK_PROCESSING" | "DONE" | "CANCELLED" | "FAILED";
  transferFee: number;
  scheduleDate?: string;
  bankAccount?: { bank: { code: string }; accountName: string; agency: string; account: string; accountDigit: string; cpfCnpj: string };
}

class AsaasIntegration {
  private config: AsaasConfig | null = null;
  private baseUrl: string = "";

  configure(config: AsaasConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.asaas.com/v3" : "https://sandbox.asaas.com/api/v3";
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.config) throw new Error("Integração não configurada");
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { "access_token": this.config.apiKey, "Content-Type": "application/json", ...options.headers }
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.errors?.[0]?.description || `Erro Asaas: ${response.status}`);
    }
    return response.json();
  }

  // Clientes
  async criarCliente(dados: Omit<AsaasCliente, "id">): Promise<AsaasCliente> {
    return this.request("/customers", { method: "POST", body: JSON.stringify(dados) });
  }

  async buscarCliente(cpfCnpj: string): Promise<AsaasCliente | null> {
    const result = await this.request<{ data: AsaasCliente[] }>(`/customers?cpfCnpj=${cpfCnpj.replace(/\D/g, "")}`);
    return result.data[0] || null;
  }

  async listarClientes(offset: number = 0, limit: number = 100): Promise<AsaasCliente[]> {
    const result = await this.request<{ data: AsaasCliente[] }>(`/customers?offset=${offset}&limit=${limit}`);
    return result.data;
  }

  // Cobranças
  async criarCobranca(dados: { customer: string; value: number; dueDate: string; billingType: "BOLETO" | "PIX" | "UNDEFINED"; description?: string; externalReference?: string }): Promise<AsaasCobranca> {
    return this.request("/payments", { method: "POST", body: JSON.stringify(dados) });
  }

  async buscarCobranca(id: string): Promise<AsaasCobranca> {
    return this.request(`/payments/${id}`);
  }

  async listarCobrancas(filtros?: { customer?: string; status?: string; billingType?: string }): Promise<AsaasCobranca[]> {
    const params = new URLSearchParams();
    if (filtros?.customer) params.append("customer", filtros.customer);
    if (filtros?.status) params.append("status", filtros.status);
    if (filtros?.billingType) params.append("billingType", filtros.billingType);
    const result = await this.request<{ data: AsaasCobranca[] }>(`/payments?${params}`);
    return result.data;
  }

  async cancelarCobranca(id: string): Promise<void> {
    await this.request(`/payments/${id}`, { method: "DELETE" });
  }

  async obterQRCodePix(id: string): Promise<{ encodedImage: string; payload: string; expirationDate: string }> {
    return this.request(`/payments/${id}/pixQrCode`);
  }

  // Transferências
  async realizarTransferencia(dados: { value: number; bankAccount: { bank: { code: string }; accountName: string; ownerName: string; cpfCnpj: string; agency: string; account: string; accountDigit: string; bankAccountType: "CONTA_CORRENTE" | "CONTA_POUPANCA" }; scheduleDate?: string }): Promise<AsaasTransferencia> {
    return this.request("/transfers", { method: "POST", body: JSON.stringify(dados) });
  }

  async realizarTransferenciaPix(dados: { value: number; pixAddressKey: string; pixAddressKeyType: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "EVP"; description?: string }): Promise<AsaasTransferencia> {
    return this.request("/transfers", { method: "POST", body: JSON.stringify({ ...dados, operationType: "PIX" }) });
  }

  async buscarTransferencia(id: string): Promise<AsaasTransferencia> {
    return this.request(`/transfers/${id}`);
  }

  async listarTransferencias(): Promise<AsaasTransferencia[]> {
    const result = await this.request<{ data: AsaasTransferencia[] }>("/transfers");
    return result.data;
  }

  // Saldo
  async consultarSaldo(): Promise<{ balance: number }> {
    return this.request("/finance/balance");
  }

  // Pagamento de Folha
  async processarFolhaPagamento(pagamentos: Array<{ colaborador: { nome: string; cpf: string; chavePix?: string; banco?: string; agencia?: string; conta?: string; digitoConta?: string }; valor: number }>): Promise<{ lote: string; resultados: Array<{ id: string; status: string }> }> {
    const loteId = `FOLHA_ASAAS_${Date.now()}`;
    const resultados = [];

    for (const pag of pagamentos) {
      try {
        let result: AsaasTransferencia;
        if (pag.colaborador.chavePix) {
          const tipoChave = pag.colaborador.chavePix.includes("@") ? "EMAIL" : pag.colaborador.chavePix.length === 11 ? "CPF" : pag.colaborador.chavePix.length === 14 ? "CNPJ" : /^\+/.test(pag.colaborador.chavePix) ? "PHONE" : "EVP";
          result = await this.realizarTransferenciaPix({ value: pag.valor, pixAddressKey: pag.colaborador.chavePix, pixAddressKeyType: tipoChave, description: "Pagamento de salário" });
        } else {
          result = await this.realizarTransferencia({
            value: pag.valor,
            bankAccount: { bank: { code: pag.colaborador.banco! }, accountName: pag.colaborador.nome, ownerName: pag.colaborador.nome, cpfCnpj: pag.colaborador.cpf, agency: pag.colaborador.agencia!, account: pag.colaborador.conta!, accountDigit: pag.colaborador.digitoConta || "0", bankAccountType: "CONTA_CORRENTE" }
          });
        }
        resultados.push({ id: result.id, status: result.status });
      } catch (e) {
        resultados.push({ id: "", status: "FAILED" });
      }
    }

    return { lote: loteId, resultados };
  }

  // Webhooks
  async configurarWebhook(url: string, eventos: string[]): Promise<{ id: string }> {
    return this.request("/webhook", { method: "POST", body: JSON.stringify({ url, events: eventos, enabled: true }) });
  }
}

export const asaas = new AsaasIntegration();
export default asaas;
