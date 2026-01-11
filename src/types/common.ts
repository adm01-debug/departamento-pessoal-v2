// V15-439
export interface PaginatedResponse<T> { data: T[]; total: number; page: number; per_page: number; total_pages: number; }
export interface ApiError { message: string; code?: string; details?: Record<string, any>; }
export interface SelectOption { value: string; label: string; disabled?: boolean; }
export interface DateRange { from: Date; to: Date; }
export type SortOrder = 'asc' | 'desc';
export interface SortConfig { field: string; order: SortOrder; }
