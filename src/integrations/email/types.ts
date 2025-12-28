// email Integration Types
export interface emailConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface emailMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface emailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
