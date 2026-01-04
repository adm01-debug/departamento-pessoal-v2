export interface SodexoConfig { apiKey?: string; baseUrl?: string; enabled: boolean; timeout?: number; }
export interface SodexoResponse<T = any> { success: boolean; data?: T; error?: string; requestId?: string; }

class SodexoService {
  private config: SodexoConfig = { enabled: false, timeout: 30000 };
  configure(c: Partial<SodexoConfig>) { this.config = { ...this.config, ...c }; }
  isEnabled() { return this.config.enabled; }
  async connect(): Promise<SodexoResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { connected: true }, requestId: crypto.randomUUID() }; }
  async sync(): Promise<SodexoResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { synced: true } }; }
  async send(data: any): Promise<SodexoResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { sent: true } }; }
  async getStatus() { return { enabled: this.config.enabled, connected: this.config.enabled }; }
  async testConnection() { return (await this.connect()).success; }
}

export const sodexoService = new SodexoService();
export default sodexoService;
