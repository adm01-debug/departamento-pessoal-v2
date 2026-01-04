// Whatsapp Integration Types

export interface WhatsappConfig {
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

export interface WhatsappResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface WhatsappPaginatedResponse<T> extends WhatsappResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface WhatsappWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface WhatsappRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface WhatsappHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type WhatsappEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface WhatsappEvent {
  type: WhatsappEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// WhatsApp Business specific types
export interface WhatsappRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface WhatsappError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isWhatsappError(error: any): error is WhatsappError {
  return error && typeof error.code === "string";
}

export const WhatsappDefaults: Partial<WhatsappConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
