/** Entidade base com campos comuns */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}
/** Status genérico */
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'archived';
/** Resultado de operação */
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
/** Filtros de listagem */
export interface ListFilters {
  search?: string;
  status?: EntityStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
