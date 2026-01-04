// Sms Integration Types

export interface SmsConfig {
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

export interface SmsResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface SmsPaginatedResponse<T> extends SmsResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SmsWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface SmsRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface SmsHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type SmsEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface SmsEvent {
  type: SmsEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Envio de SMS specific types
export interface SmsRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface SmsError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isSmsError(error: any): error is SmsError {
  return error && typeof error.code === "string";
}

export const SmsDefaults: Partial<SmsConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
