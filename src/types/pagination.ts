/**
 * @fileoverview Tipos para paginação
 * @module types/pagination
 */

/** Resposta paginada genérica */
export interface PaginatedResponse<T> {
  /** Dados da página atual */
  data: T[];
  /** Total de registros */
  count: number;
  /** Página atual */
  page: number;
  /** Tamanho da página */
  pageSize: number;
  /** Total de páginas */
  totalPages: number;
  /** Se há próxima página */
  hasNextPage: boolean;
  /** Se há página anterior */
  hasPreviousPage: boolean;
}

/** Parâmetros de paginação */
export interface PaginationParams {
  /** Página atual (1-indexed) */
  page?: number;
  /** Tamanho da página */
  pageSize?: number;
  /** Campo para ordenação */
  sortBy?: string;
  /** Direção da ordenação */
  sortOrder?: 'asc' | 'desc';
}

/** Parâmetros de filtro genérico */
export interface FilterParams {
  /** Termo de busca */
  search?: string;
  /** Filtros específicos */
  filters?: Record<string, string | number | boolean | null>;
  /** Intervalo de datas */
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Calcula o total de páginas
 * @param totalItems - Total de itens
 * @param pageSize - Tamanho da página
 * @returns Total de páginas
 */
export function calculateTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

/**
 * Calcula o offset para query
 * @param page - Página atual (1-indexed)
 * @param pageSize - Tamanho da página
 * @returns Offset para query
 */
export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Cria resposta paginada
 * @param data - Dados da página
 * @param count - Total de registros
 * @param page - Página atual
 * @param pageSize - Tamanho da página
 * @returns Resposta paginada completa
 */
export function createPaginatedResponse<T>(
  data: T[],
  count: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const totalPages = calculateTotalPages(count, pageSize);
  
  return {
    data,
    count,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
