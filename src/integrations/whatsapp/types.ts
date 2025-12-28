// whatsapp Integration Types
export interface whatsappConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface whatsappMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface whatsappResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
