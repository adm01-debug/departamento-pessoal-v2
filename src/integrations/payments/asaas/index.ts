/**
 * Integração Asaas
 * API: https://docs.asaas.com
 * Funcionalidades: Cobranças, Boletos, PIX, Transferências
 */

export interface AsaasConfig {
  apiKey: string;
  ambiente: "sandbox" | "producao";
  walletId?: string;
}

export interface AsaasCliente {
  id?: string;
  name: string;
  cpfCnpj: string;
  email?: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  province?: string;
  postalCode?: string;
}

export interface AsaasCobranca {
  id?: string;
  customer: string;
  billingType: "BOLETO" | "PIX" | "CREDIT_CARD" | "UNDEFINED";
  value: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
  installmentCount?: number;
  installmentValue?: number;
  discount?: { value: number; dueDateLimitDays: number; type: "FIXED" | "PERCENTAGE" };
  interest?: { value: number };
  fine?: { value: number };
}

class AsaasService {
  private config: AsaasConfig | null = null;
  private baseUrl = "";

  configurar(config: AsaasConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.asaas.com/v3" : "https://sandbox.asaas.com/api/v3";
  }

  private getHeaders(): HeadersInit {
    if (!this.config) throw new Error("Asaas não configurado");
    return { "Content-Type": "application/json", "access_token": this.config.apiKey };
  }

  async criarCliente(cliente: AsaasCliente): Promise<AsaasCliente> {
    const response = await fetch(`${this.baseUrl}/customers`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(cliente)
    });
    if (!response.ok) throw new Error("Falha ao criar cliente");
    return response.json();
  }

  async buscarCliente(cpfCnpj: string): Promise<AsaasCliente | null> {
    const response = await fetch(`${this.baseUrl}/customers?cpfCnpj=${cpfCnpj}`, { headers: this.getHeaders() });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data?.[0] || null;
  }

  async criarCobranca(cobranca: AsaasCobranca): Promise<{ id: string; invoiceUrl: string; bankSlipUrl?: string; pixQrCode?: string; pixCopiaECola?: string }> {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(cobranca)
    });
    if (!response.ok) throw new Error("Falha ao criar cobrança");
    return response.json();
  }

  async consultarCobranca(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/payments/${id}`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error("Falha ao consultar cobrança");
    return response.json();
  }

  async listarCobrancas(filtros?: { customer?: string; status?: string; dateCreated?: string }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filtros?.customer) params.append("customer", filtros.customer);
    if (filtros?.status) params.append("status", filtros.status);
    if (filtros?.dateCreated) params.append("dateCreated", filtros.dateCreated);
    const response = await fetch(`${this.baseUrl}/payments?${params}`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error("Falha ao listar cobranças");
    const data = await response.json();
    return data.data || [];
  }

  async gerarBoleto(customerId: string, valor: number, vencimento: string, descricao?: string): Promise<{ id: string; bankSlipUrl: string; barCode: string; identificationField: string }> {
    const cobranca = await this.criarCobranca({ customer: customerId, billingType: "BOLETO", value: valor, dueDate: vencimento, description: descricao });
    return { id: cobranca.id, bankSlipUrl: cobranca.bankSlipUrl || "", barCode: "", identificationField: "" };
  }

  async gerarPixCobranca(customerId: string, valor: number, descricao?: string): Promise<{ id: string; qrCode: string; copiaECola: string }> {
    const cobranca = await this.criarCobranca({ customer: customerId, billingType: "PIX", value: valor, dueDate: new Date().toISOString().split("T")[0], description: descricao });
    return { id: cobranca.id, qrCode: cobranca.pixQrCode || "", copiaECola: cobranca.pixCopiaECola || "" };
  }

  async realizarTransferencia(valor: number, banco: string, agencia: string, conta: string, tipoConta: string, cpfCnpj: string, nome: string): Promise<{ id: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/transfers`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ value: valor, bankAccount: { bank: { code: banco }, accountName: nome, ownerName: nome, cpfCnpj, agency: agencia, account: conta, accountDigit: "0", bankAccountType: tipoConta } })
    });
    if (!response.ok) throw new Error("Falha na transferência");
    const data = await response.json();
    return { id: data.id, status: data.status };
  }

  async realizarPixTransferencia(chavePix: string, valor: number, descricao?: string): Promise<{ id: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/transfers`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ value: valor, pixAddressKey: chavePix, description: descricao })
    });
    if (!response.ok) throw new Error("Falha no PIX");
    const data = await response.json();
    return { id: data.id, status: data.status };
  }

  async consultarSaldo(): Promise<{ balance: number }> {
    const response = await fetch(`${this.baseUrl}/finance/balance`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error("Falha ao consultar saldo");
    return response.json();
  }

  async processarFolhaPagamento(pagamentos: Array<{ nome: string; cpf: string; chavePix?: string; banco?: string; agencia?: string; conta?: string; valor: number }>): Promise<{ total: number; processados: number }> {
    let processados = 0;
    for (const p of pagamentos) {
      try {
        if (p.chavePix) {
          await this.realizarPixTransferencia(p.chavePix, p.valor, `Salário - ${p.nome}`);
        } else if (p.banco && p.agencia && p.conta) {
          await this.realizarTransferencia(p.valor, p.banco, p.agencia, p.conta, "CONTA_CORRENTE", p.cpf, p.nome);
        }
        processados++;
      } catch (e) { console.error(`Erro pagamento ${p.nome}:`, e); }
    }
    return { total: pagamentos.length, processados };
  }
}

export const asaasService = new AsaasService();
export default asaasService;
