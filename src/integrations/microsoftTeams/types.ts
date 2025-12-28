// microsoftTeams Integration Types
export interface microsoftTeamsConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface microsoftTeamsMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface microsoftTeamsResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
