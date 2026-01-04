// Slack Integration Types

export interface SlackConfig {
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

export interface SlackResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface SlackPaginatedResponse<T> extends SlackResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SlackWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface SlackRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface SlackHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type SlackEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface SlackEvent {
  type: SlackEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Integração Slack specific types
export interface SlackRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface SlackError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isSlackError(error: any): error is SlackError {
  return error && typeof error.code === "string";
}

export const SlackDefaults: Partial<SlackConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
