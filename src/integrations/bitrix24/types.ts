// Bitrix24 Integration Types

export interface Bitrix24Config {
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

export interface Bitrix24Response<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface Bitrix24PaginatedResponse<T> extends Bitrix24Response<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Bitrix24WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface Bitrix24RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface Bitrix24HealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type Bitrix24EventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface Bitrix24Event {
  type: Bitrix24EventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// CRM Bitrix24 specific types
export interface Bitrix24Request {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface Bitrix24Error extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isBitrix24Error(error: any): error is Bitrix24Error {
  return error && typeof error.code === "string";
}

export const Bitrix24Defaults: Partial<Bitrix24Config> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
