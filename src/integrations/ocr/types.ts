// ocr Integration Types
export interface ocrConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface ocrMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface ocrResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
