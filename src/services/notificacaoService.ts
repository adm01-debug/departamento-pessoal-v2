export type NotificationType = "info" | "success" | "warning" | "error";
export interface Notificacao { id: string; type: NotificationType; title: string; message: string; read: boolean; createdAt: string; userId: string; actionUrl?: string; actionLabel?: string; metadata?: Record<string, any>; }
export interface NotificacaoConfig { maxPerUser: number; retentionDays: number; channels: { inApp: boolean; email: boolean; push: boolean; sms: boolean }; }

class NotificacaoService {
  private notificacoes: Notificacao[] = [];
  private config: NotificacaoConfig = { maxPerUser: 100, retentionDays: 30, channels: { inApp: true, email: true, push: false, sms: false } };
  private listeners: Set<(n: Notificacao) => void> = new Set();

  configure(config: Partial<NotificacaoConfig>): void { this.config = { ...this.config, ...config }; }

  async create(data: Omit<Notificacao, "id" | "read" | "createdAt">): Promise<Notificacao> {
    const notificacao: Notificacao = { ...data, id: crypto.randomUUID(), read: false, createdAt: new Date().toISOString() };
    this.notificacoes.unshift(notificacao);
    this.cleanup(data.userId);
    this.listeners.forEach(l => l(notificacao));
    return notificacao;
  }

  private cleanup(userId: string): void {
    const userNotifs = this.notificacoes.filter(n => n.userId === userId);
    if (userNotifs.length > this.config.maxPerUser) {
      const toRemove = userNotifs.slice(this.config.maxPerUser);
      toRemove.forEach(n => { const idx = this.notificacoes.indexOf(n); if (idx > -1) this.notificacoes.splice(idx, 1); });
    }
  }

  async getByUser(userId: string, unreadOnly = false): Promise<Notificacao[]> {
    return this.notificacoes.filter(n => n.userId === userId && (!unreadOnly || !n.read));
  }

  async markAsRead(id: string): Promise<void> { const n = this.notificacoes.find(n => n.id === id); if (n) n.read = true; }
  async markAllAsRead(userId: string): Promise<void> { this.notificacoes.filter(n => n.userId === userId).forEach(n => n.read = true); }
  async delete(id: string): Promise<void> { const idx = this.notificacoes.findIndex(n => n.id === id); if (idx > -1) this.notificacoes.splice(idx, 1); }
  async deleteAll(userId: string): Promise<void> { this.notificacoes = this.notificacoes.filter(n => n.userId !== userId); }
  async getUnreadCount(userId: string): Promise<number> { return this.notificacoes.filter(n => n.userId === userId && !n.read).length; }

  subscribe(callback: (n: Notificacao) => void): () => void { this.listeners.add(callback); return () => this.listeners.delete(callback); }

  async notifyInfo(userId: string, title: string, message: string): Promise<Notificacao> { return this.create({ type: "info", title, message, userId }); }
  async notifySuccess(userId: string, title: string, message: string): Promise<Notificacao> { return this.create({ type: "success", title, message, userId }); }
  async notifyWarning(userId: string, title: string, message: string): Promise<Notificacao> { return this.create({ type: "warning", title, message, userId }); }
  async notifyError(userId: string, title: string, message: string): Promise<Notificacao> { return this.create({ type: "error", title, message, userId }); }
}

export const notificacaoService = new NotificacaoService();
export default notificacaoService;
