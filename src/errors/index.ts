// V20: Errors Index - Clean Exports
export { ErrorBoundary } from "./ErrorBoundary";
export { 
  AppError, 
  ValidationError, 
  AuthError, 
  NetworkError, 
  NotFoundError, 
  PermissionError,
  getErrorMessage,
  isAppError 
} from "./AppError";
export type { ErrorType, ErrorSeverity, ErrorDetails } from "./types";
