// pix Integration Types
export interface pixConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface pixMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface pixResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
