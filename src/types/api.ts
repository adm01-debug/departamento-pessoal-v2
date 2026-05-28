// Tipos genéricos para chamadas de API

/** Resposta padronizada de sucesso */
export interface ApiResponse<T> {
  data: T;
  success: true;
}

/** Resposta padronizada de erro */
export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

/** Resposta paginada padrão */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Tipo union para resultado de operação */
export type ApiResult<T> = ApiResponse<T> | ApiError;