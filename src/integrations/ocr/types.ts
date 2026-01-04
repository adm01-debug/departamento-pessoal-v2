// Ocr Integration Types

export interface OcrConfig {
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

export interface OcrResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface OcrPaginatedResponse<T> extends OcrResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface OcrWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface OcrRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface OcrHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type OcrEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface OcrEvent {
  type: OcrEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// OCR e Reconhecimento de Texto specific types
export interface OcrRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface OcrError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isOcrError(error: any): error is OcrError {
  return error && typeof error.code === "string";
}

export const OcrDefaults: Partial<OcrConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
