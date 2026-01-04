// Erp Integration Types

export interface ErpConfig {
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

export interface ErpResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface ErpPaginatedResponse<T> extends ErpResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErpWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface ErpRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface ErpHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type ErpEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface ErpEvent {
  type: ErpEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ERP Integration specific types
export interface ErpRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface ErpError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isErpError(error: any): error is ErpError {
  return error && typeof error.code === "string";
}

export const ErpDefaults: Partial<ErpConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
