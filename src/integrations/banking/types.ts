// Banking Integration Types

export interface BankingConfig {
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

export interface BankingResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface BankingPaginatedResponse<T> extends BankingResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BankingWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface BankingRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface BankingHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type BankingEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface BankingEvent {
  type: BankingEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Banking Integration specific types
export interface BankingRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface BankingError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isBankingError(error: any): error is BankingError {
  return error && typeof error.code === "string";
}

export const BankingDefaults: Partial<BankingConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
