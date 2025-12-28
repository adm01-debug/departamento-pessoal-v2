// pushNotifications Integration Types
export interface pushNotificationsConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface pushNotificationsMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface pushNotificationsResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
