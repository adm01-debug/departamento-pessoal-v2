// slack Integration Types
export interface slackConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface slackMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface slackResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
