// Email Integration Types

export interface EmailConfig {
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

export interface EmailResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface EmailPaginatedResponse<T> extends EmailResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface EmailWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface EmailRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface EmailHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type EmailEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface EmailEvent {
  type: EmailEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Serviço de Email specific types
export interface EmailRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface EmailError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isEmailError(error: any): error is EmailError {
  return error && typeof error.code === "string";
}

export const EmailDefaults: Partial<EmailConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
