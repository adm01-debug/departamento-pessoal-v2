/**
 * Integração Nubank Empresas
 * API: https://developer.nubank.com.br
 */

export interface NubankConfig {
  clientId: string;
  clientSecret: string;
  certificado: string;
  ambiente: "sandbox" | "producao";
}

class NubankService {
  private config: NubankConfig | null = null;
  private token: string | null = null;
  private baseUrl = "";

  configurar(config: NubankConfig): void {
    this.config = config;
    this.baseUrl = config.ambiente === "producao" ? "https://api.nubank.com.br" : "https://api.sandbox.nubank.com.br";
  }

  private async obterToken(): Promise<string> {
    if (!this.config) throw new Error("Nubank não configurado");
    if (this.token) return this.token;
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: this.config.clientId, client_secret: this.config.clientSecret, grant_type: "client_credentials" })
    });
    if (!response.ok) throw new Error("Falha na autenticação Nubank");
    const data = await response.json();
    this.token = data.access_token;
    return this.token!;
  }

  async consultarSaldo(): Promise<{ disponivel: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/api/accounts/balance`, { headers: { "Authorization": `Bearer ${token}` } });
    if (!response.ok) throw new Error("Falha ao consultar saldo");
    const data = await response.json();
    return { disponivel: data.available || 0 };
  }

  async consultarExtrato(dataInicio: string, dataFim: string): Promise<{ transacoes: any[] }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/api/accounts/statements?start_date=${dataInicio}&end_date=${dataFim}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Falha ao consultar extrato");
    return response.json();
  }

  async realizarPix(chavePix: string, valor: number, descricao?: string): Promise<{ transactionId: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/api/pix/payments`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ key: chavePix, amount: Math.round(valor * 100), description: descricao })
    });
    if (!response.ok) throw new Error("Falha no PIX");
    const data = await response.json();
    return { transactionId: data.id, status: data.status };
  }

  async realizarTransferencia(beneficiario: { nome: string; cpfCnpj: string; banco: string; agencia: string; conta: string }, valor: number): Promise<{ transactionId: string; status: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/api/transfers`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ recipient: beneficiario, amount: Math.round(valor * 100) })
    });
    if (!response.ok) throw new Error("Falha na transferência");
    const data = await response.json();
    return { transactionId: data.id, status: data.status };
  }

  async gerarQRCodePix(valor: number, descricao?: string): Promise<{ qrCode: string; qrCodeBase64: string; txid: string }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/api/pix/qrcode`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(valor * 100), description: descricao })
    });
    if (!response.ok) throw new Error("Falha ao gerar QR Code");
    return response.json();
  }

  async processarFolhaPagamento(pagamentos: Array<{ nome: string; cpf: string; chavePix: string; valor: number }>): Promise<{ batchId: string; quantidade: number; valorTotal: number }> {
    const token = await this.obterToken();
    const response = await fetch(`${this.baseUrl}/api/pix/batch`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ payments: pagamentos.map(p => ({ key: p.chavePix, amount: Math.round(p.valor * 100), description: `Salário - ${p.nome}` })) })
    });
    if (!response.ok) throw new Error("Falha ao processar folha");
    const data = await response.json();
    return { batchId: data.batch_id, quantidade: pagamentos.length, valorTotal: pagamentos.reduce((s, p) => s + p.valor, 0) };
  }
}

export const nubankService = new NubankService();
export default nubankService;
