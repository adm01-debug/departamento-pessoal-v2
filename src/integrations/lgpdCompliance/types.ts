// LgpdCompliance Integration Types

export interface LgpdComplianceConfig {
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

export interface LgpdComplianceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface LgpdCompliancePaginatedResponse<T> extends LgpdComplianceResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LgpdComplianceWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface LgpdComplianceRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface LgpdComplianceHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type LgpdComplianceEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface LgpdComplianceEvent {
  type: LgpdComplianceEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// LGPD Compliance specific types
export interface LgpdComplianceRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface LgpdComplianceError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isLgpdComplianceError(error: any): error is LgpdComplianceError {
  return error && typeof error.code === "string";
}

export const LgpdComplianceDefaults: Partial<LgpdComplianceConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
