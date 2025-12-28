// lgpdCompliance Integration Types
export interface lgpdComplianceConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface lgpdComplianceMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface lgpdComplianceResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
