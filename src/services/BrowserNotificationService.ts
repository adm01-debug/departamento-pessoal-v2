/**
 * @fileoverview Serviço de notificações push do navegador
 * @module services/BrowserNotificationService
 */

export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  data?: Record<string, unknown>;
}

class BrowserNotificationService {
  private static instance: BrowserNotificationService;
  private permission: NotificationPermission = 'default';
  private swRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {
    this.init();
  }

  static getInstance(): BrowserNotificationService {
    if (!BrowserNotificationService.instance) {
      BrowserNotificationService.instance = new BrowserNotificationService();
    }
    return BrowserNotificationService.instance;
  }

  private async init() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }

    // Register service worker for persistent notifications
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.ready;
      } catch (error) {
        console.log('Service Worker not available for notifications');
      }
    }
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported in this browser');
      return 'denied';
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  async send(config: NotificationConfig): Promise<Notification | null> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/favicon.ico',
        tag: config.tag,
        requireInteraction: config.requireInteraction ?? false,
        silent: config.silent ?? false,
        data: config.data,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }

  // Notificações específicas para segurança
  async sendSecurityAlert(
    type: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    message: string,
    details?: Record<string, unknown>
  ): Promise<Notification | null> {
    const severityConfig = {
      critical: { icon: '🚨', requireInteraction: true },
      high: { icon: '⚠️', requireInteraction: true },
      medium: { icon: '⚡', requireInteraction: false },
      low: { icon: 'ℹ️', requireInteraction: false },
    };

    const config = severityConfig[severity];

    return this.send({
      title: `${config.icon} Alerta de Segurança - ${severity.toUpperCase()}`,
      body: `${type}: ${message}`,
      tag: `security-${type}-${Date.now()}`,
      requireInteraction: config.requireInteraction,
      data: { type, severity, ...details },
    });
  }

  async sendLoginAlert(
    success: boolean,
    ipAddress?: string,
    location?: string
  ): Promise<Notification | null> {
    if (success) {
      return this.send({
        title: '✅ Novo Login Detectado',
        body: `Login realizado${ipAddress ? ` de ${ipAddress}` : ''}${location ? ` (${location})` : ''}`,
        tag: 'login-success',
        requireInteraction: false,
      });
    } else {
      return this.send({
        title: '🚫 Tentativa de Login Falhou',
        body: `Tentativa de login falhou${ipAddress ? ` de ${ipAddress}` : ''}`,
        tag: 'login-failed',
        requireInteraction: true,
      });
    }
  }

  async sendSessionAlert(
    type: 'expired' | 'new_device' | 'concurrent'
  ): Promise<Notification | null> {
    const messages = {
      expired: {
        title: '🔐 Sessão Expirada',
        body: 'Sua sessão expirou. Por favor, faça login novamente.',
      },
      new_device: {
        title: '📱 Novo Dispositivo Detectado',
        body: 'Um novo dispositivo acessou sua conta.',
      },
      concurrent: {
        title: '👥 Sessão Concorrente',
        body: 'Sua conta está sendo acessada de outro local.',
      },
    };

    const msg = messages[type];
    return this.send({
      title: msg.title,
      body: msg.body,
      tag: `session-${type}`,
      requireInteraction: type !== 'expired',
    });
  }
}

export const browserNotificationService = BrowserNotificationService.getInstance();
export default browserNotificationService;
