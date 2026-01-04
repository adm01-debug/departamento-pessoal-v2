// PushNotifications Integration Types

export interface PushNotificationsConfig {
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

export interface PushNotificationsResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface PushNotificationsPaginatedResponse<T> extends PushNotificationsResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PushNotificationsWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface PushNotificationsRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface PushNotificationsHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type PushNotificationsEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface PushNotificationsEvent {
  type: PushNotificationsEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Push Notifications specific types
export interface PushNotificationsRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface PushNotificationsError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isPushNotificationsError(error: any): error is PushNotificationsError {
  return error && typeof error.code === "string";
}

export const PushNotificationsDefaults: Partial<PushNotificationsConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
