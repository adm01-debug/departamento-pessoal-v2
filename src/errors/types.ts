export type ErrorType = 
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'NETWORK_ERROR'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorDetails {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  field?: string;
  timestamp: Date;
}
