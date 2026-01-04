export interface OmieConfig { apiKey?: string; baseUrl?: string; enabled: boolean; timeout?: number; }
export interface OmieResponse<T = any> { success: boolean; data?: T; error?: string; requestId?: string; }

class OmieService {
  private config: OmieConfig = { enabled: false, timeout: 30000 };
  configure(c: Partial<OmieConfig>) { this.config = { ...this.config, ...c }; }
  isEnabled() { return this.config.enabled; }
  async connect(): Promise<OmieResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { connected: true }, requestId: crypto.randomUUID() }; }
  async sync(): Promise<OmieResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { synced: true } }; }
  async send(data: any): Promise<OmieResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { sent: true } }; }
  async getStatus() { return { enabled: this.config.enabled, connected: this.config.enabled }; }
  async testConnection() { return (await this.connect()).success; }
}

export const omieService = new OmieService();
export default omieService;
