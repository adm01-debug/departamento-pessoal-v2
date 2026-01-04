// GoogleCalendar Integration Types

export interface GoogleCalendarConfig {
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

export interface GoogleCalendarResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  requestId?: string;
  timestamp: string;
  statusCode?: number;
}

export interface GoogleCalendarPaginatedResponse<T> extends GoogleCalendarResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GoogleCalendarWebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface GoogleCalendarRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface GoogleCalendarHealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  message?: string;
}

export type GoogleCalendarEventType = "created" | "updated" | "deleted" | "error" | "webhook";

export interface GoogleCalendarEvent {
  type: GoogleCalendarEventType;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Google Calendar specific types
export interface GoogleCalendarRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface GoogleCalendarError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export function isGoogleCalendarError(error: any): error is GoogleCalendarError {
  return error && typeof error.code === "string";
}

export const GoogleCalendarDefaults: Partial<GoogleCalendarConfig> = {
  timeout: 30000,
  retries: 3,
  sandbox: false,
  enabled: false,
};
