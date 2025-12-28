// boleto Integration Types
export interface boletoConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface boletoMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface boletoResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
