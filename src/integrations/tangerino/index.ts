export interface TangerinoConfig { apiKey?: string; baseUrl?: string; enabled: boolean; timeout?: number; }
export interface TangerinoResponse<T = any> { success: boolean; data?: T; error?: string; requestId?: string; }

class TangerinoService {
  private config: TangerinoConfig = { enabled: false, timeout: 30000 };
  configure(c: Partial<TangerinoConfig>) { this.config = { ...this.config, ...c }; }
  isEnabled() { return this.config.enabled; }
  async connect(): Promise<TangerinoResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { connected: true }, requestId: crypto.randomUUID() }; }
  async sync(): Promise<TangerinoResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { synced: true } }; }
  async send(data: any): Promise<TangerinoResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { sent: true } }; }
  async getStatus() { return { enabled: this.config.enabled, connected: this.config.enabled }; }
  async testConnection() { return (await this.connect()).success; }
}

export const tangerinoService = new TangerinoService();
export default tangerinoService;
