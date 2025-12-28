// sms Integration Types
export interface smsConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface smsMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface smsResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
