export interface LocationApiConfig { apiKey?: string; baseUrl?: string; enabled: boolean; timeout?: number; }
export interface LocationApiResponse<T = any> { success: boolean; data?: T; error?: string; requestId?: string; }

class LocationApiService {
  private config: LocationApiConfig = { enabled: false, timeout: 30000 };
  configure(c: Partial<LocationApiConfig>) { this.config = { ...this.config, ...c }; }
  isEnabled() { return this.config.enabled; }
  async connect(): Promise<LocationApiResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { connected: true }, requestId: crypto.randomUUID() }; }
  async sync(): Promise<LocationApiResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { synced: true } }; }
  async send(data: any): Promise<LocationApiResponse> { if (!this.config.enabled) return { success: false, error: "Disabled" }; return { success: true, data: { sent: true } }; }
  async getStatus() { return { enabled: this.config.enabled, connected: this.config.enabled }; }
  async testConnection() { return (await this.connect()).success; }
}

export const locationApiService = new LocationApiService();
export default locationApiService;
