/** Tipos comuns do sistema */

export type ID = string | number;

export type Status = 'pending' | 'active' | 'inactive' | 'archived';

export interface Timestamps { created_at: string; updated_at: string; }

export interface AuditFields extends Timestamps { created_by?: string; updated_by?: string; }

export interface PaginationParams { page: number; per_page: number; }

export interface PaginatedResponse<T> { data: T[]; total: number; page: number; per_page: number; total_pages: number; }

export interface SortParams { sort_by: string; sort_order: 'asc' | 'desc'; }

export interface FilterParams { search?: string; status?: Status; from_date?: string; to_date?: string; }

export interface ApiResponse<T> { data: T; success: boolean; message?: string; }

export interface ApiError { code: string; message: string; details?: Record<string, string[]>; }

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> { status: AsyncStatus; data: T | null; error: Error | null; }

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]; };

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OmitId<T> = Omit<T, 'id'>;

export type WithId<T> = T & { id: ID };
