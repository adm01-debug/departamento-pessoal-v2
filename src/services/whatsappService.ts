export interface WhatsAppConfig { apiKey?: string; phoneNumberId?: string; enabled: boolean; }
export interface WhatsAppMessage { to: string; text?: string; template?: string; params?: Record<string, string>; }
export interface WhatsAppResponse { success: boolean; messageId?: string; error?: string; }

class WhatsAppService {
  private config: WhatsAppConfig = { enabled: false };
  configure(c: Partial<WhatsAppConfig>) { this.config = { ...this.config, ...c }; }
  isEnabled() { return this.config.enabled; }
  async sendMessage(msg: WhatsAppMessage): Promise<WhatsAppResponse> {
    if (!this.config.enabled) return { success: false, error: "Service not enabled" };
    console.log("[WhatsApp] Sending to:", msg.to);
    return { success: true, messageId: crypto.randomUUID() };
  }
  async sendTemplate(to: string, template: string, params?: Record<string, string>): Promise<WhatsAppResponse> { return this.sendMessage({ to, template, params }); }
  async getStatus() { return { enabled: this.config.enabled, configured: !!this.config.apiKey }; }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;
