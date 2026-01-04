// MicrosoftTeams Integration Types

export interface MicrosoftTeamsConfig {
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  sandbox?: boolean;
  enabled: boolean;
  webhookUrl?: string;
  credentials?: Record<string, string>;
}

export interface MicrosoftTeamsResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface MicrosoftTeamsPaginatedResponse<T> extends MicrosoftTeamsResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MicrosoftTeamsWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface MicrosoftTeamsRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface MicrosoftTeamsHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type MicrosoftTeamsEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface MicrosoftTeamsEvent {
  type: MicrosoftTeamsEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Microsoft Teams specific types
export interface MicrosoftTeamsRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface MicrosoftTeamsError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isMicrosoftTeamsError(error: any): error is MicrosoftTeamsError {
  return error && typeof error.code === "string";
}

export const MicrosoftTeamsDefaults: Partial<MicrosoftTeamsConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
