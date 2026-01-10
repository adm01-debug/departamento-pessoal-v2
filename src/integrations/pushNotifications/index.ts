// V14-076: pushNotifications/index.ts
export interface PushConfig {
  vapidPublicKey: string;
  vapidPrivateKey: string;
  subject: string;
}

export interface PushSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

export class PushNotificationsIntegration {
  private config: PushConfig;
  private subscriptions: Map<string, PushSubscription> = new Map();

  constructor(config: PushConfig) {
    this.config = config;
  }

  getVapidPublicKey(): string {
    return this.config.vapidPublicKey;
  }

  saveSubscription(userId: string, subscription: PushSubscription): void {
    this.subscriptions.set(userId, subscription);
  }

  removeSubscription(userId: string): void {
    this.subscriptions.delete(userId);
  }

  async sendNotification(userId: string, notification: PushNotification): Promise<boolean> {
    const subscription = this.subscriptions.get(userId);
    if (!subscription) return false;
    // Simulação - em produção usar web-push library
    console.log("Enviando push notification:", { userId, notification, subscription: subscription.endpoint });
    return true;
  }

  async sendToAll(notification: PushNotification): Promise<{ sent: number; failed: number }> {
    let sent = 0, failed = 0;
    for (const [userId] of this.subscriptions) {
      const success = await this.sendNotification(userId, notification);
      success ? sent++ : failed++;
    }
    return { sent, failed };
  }

  createPayrollNotification(competencia: string, valorLiquido: string): PushNotification {
    return {
      title: "Folha de Pagamento",
      body: `Sua folha de ${competencia} está disponível. Valor líquido: ${valorLiquido}`,
      icon: "/icons/money.png",
      tag: `payroll-${competencia}`,
      data: { type: "payroll", competencia },
    };
  }

  createVacationNotification(startDate: string, days: number): PushNotification {
    return {
      title: "Férias Aprovadas",
      body: `Suas férias foram aprovadas! ${days} dias a partir de ${startDate}`,
      icon: "/icons/vacation.png",
      tag: "vacation-approved",
      data: { type: "vacation", startDate, days },
    };
  }
}

export const createPushNotifications = (config: PushConfig) => new PushNotificationsIntegration(config);

