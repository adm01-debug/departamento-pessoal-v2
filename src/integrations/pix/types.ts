// Pix Integration Types

export interface PixConfig {
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

export interface PixResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface PixPaginatedResponse<T> extends PixResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PixWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface PixRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface PixHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type PixEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface PixEvent {
  type: PixEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Pagamentos PIX specific types
export interface PixRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface PixError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isPixError(error: any): error is PixError {
  return error && typeof error.code === "string";
}

export const PixDefaults: Partial<PixConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
