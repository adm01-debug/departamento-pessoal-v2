// locationApi Integration Types
export interface locationApiConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface locationApiMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface locationApiResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
