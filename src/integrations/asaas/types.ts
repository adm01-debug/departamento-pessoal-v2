// Asaas Integration Types

export interface AsaasConfig {
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

export interface AsaasResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface AsaasPaginatedResponse<T> extends AsaasResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AsaasWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface AsaasRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface AsaasHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type AsaasEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface AsaasEvent {
  type: AsaasEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Gateway de Pagamentos Asaas specific types
export interface AsaasRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface AsaasError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isAsaasError(error: any): error is AsaasError {
  return error && typeof error.code === "string";
}

export const AsaasDefaults: Partial<AsaasConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
