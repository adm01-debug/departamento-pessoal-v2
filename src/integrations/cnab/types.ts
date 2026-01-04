// Cnab Integration Types

export interface CnabConfig {
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

export interface CnabResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface CnabPaginatedResponse<T> extends CnabResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CnabWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface CnabRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface CnabHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type CnabEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface CnabEvent {
  type: CnabEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Arquivos CNAB Bancários specific types
export interface CnabRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface CnabError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isCnabError(error: any): error is CnabError {
  return error && typeof error.code === "string";
}

export const CnabDefaults: Partial<CnabConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
