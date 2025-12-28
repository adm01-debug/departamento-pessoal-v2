// certificadoDigital Integration Types
export interface certificadoDigitalConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface certificadoDigitalMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface certificadoDigitalResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
