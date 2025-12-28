// cnab Integration Types
export interface cnabConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface cnabMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface cnabResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
