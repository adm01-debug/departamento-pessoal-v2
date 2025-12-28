// googleCalendar Integration Types
export interface googleCalendarConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface googleCalendarMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface googleCalendarResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
