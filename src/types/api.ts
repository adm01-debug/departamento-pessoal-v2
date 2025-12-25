/**
 * @fileoverview Tipos para respostas de API
 * @module types/api
 */

/** Resposta de sucesso da API */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/** Resposta de erro da API */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/** Resposta genérica da API */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Status de loading */
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/** Estado de mutação */
export interface MutationState<T> extends LoadingState {
  data: T | null;
  isSuccess: boolean;
}

/**
 * Type guard para verificar se resposta é sucesso
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard para verificar se resposta é erro
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return response.success === false;
}
