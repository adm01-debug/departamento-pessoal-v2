export interface OcrConfig { apiKey?: string; baseUrl?: string; enabled: boolean; timeout?: number; }
export interface OcrResponse<T = any> { success: boolean; data?: T; error?: string; requestId?: string; }

class OcrService {
  private config: OcrConfig = { enabled: false, timeout: 30000 };
  configure(c: Partial<OcrConfig>) { this.config = { ...this.config, ...c }; }
  isEnabled() { return this.config.enabled; }
  async connect(): Promise<OcrResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { connected: true }, requestId: crypto.randomUUID() }; }
  async sync(): Promise<OcrResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { synced: true } }; }
  async send(data: any): Promise<OcrResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { sent: true } }; }
  async getStatus() { return { enabled: this.config.enabled, connected: this.config.enabled }; }
  async testConnection() { return (await this.connect()).success; }
}

export const ocrService = new OcrService();
export default ocrService;
