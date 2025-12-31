/**
 * ============================================
 * CRUD TOOLKIT - DP SYSTEM
 * ============================================
 * 
 * Conjunto completo de hooks e componentes para
 * operações CRUD avançadas.
 * 
 * @example
 * ```tsx
 * import { useCRUD, DataImporter, Pagination } from '@/lib/crud';
 * 
 * const { useList, create, update, delete } = useCRUD({
 *   tableName: 'colaboradores'
 * });
 * ```
 */

// ==================== HOOKS ====================

// Hook genérico de CRUD
export { useCRUD } from '@/hooks/useCRUD';
export type { CRUDOptions, CRUDFilters } from '@/hooks/useCRUD';

// Filtros salvos
export { useSavedFilters } from '@/hooks/useSavedFilters';
export type { SavedFilter, CreateFilterInput } from '@/hooks/useSavedFilters';

// Busca fulltext
export { useFulltextSearch, useLocalSearch, highlightSearchTerm, HighlightedText } from '@/hooks/useFulltextSearch';
export type { SearchOptions, SearchResult } from '@/hooks/useFulltextSearch';

// Debounce e throttle
export { useDebouncedValue, useDebouncedCallback, useThrottledValue } from '@/hooks/useDebouncedValue';

// Versionamento
export { useVersioning, useAutoSaveWithVersion } from '@/hooks/useVersioning';
export type { Version, VersionDiff } from '@/hooks/useVersioning';

// Duplicação
export { useDuplicate, useDuplicateWithRelations, duplicateTransforms } from '@/hooks/useDuplicate';
export type { DuplicateOptions } from '@/hooks/useDuplicate';

// Infinite scroll
export { useInfiniteScroll, InfiniteScrollTrigger, useVirtualScroll } from '@/hooks/useInfiniteScroll';
export type { InfiniteScrollOptions, UseInfiniteScrollResult } from '@/hooks/useInfiniteScroll';

// Ações em lote
export { useBulkActions, createBulkSupabaseActions, BulkSelectCheckbox } from '@/hooks/useBulkActions';
export type { BulkAction, UseBulkActionsOptions } from '@/hooks/useBulkActions';

// Soft delete
export { useSoftDelete, useTrash } from '@/hooks/useSoftDelete';
export type { SoftDeleteOptions } from '@/hooks/useSoftDelete';


// ==================== COMPONENTES ====================

// Importação de dados
export { DataImporter } from '@/components/DataImporter';

// Filtros
export { SavedFiltersDropdown } from '@/components/SavedFiltersDropdown';
export { AdvancedFilters, ActiveFiltersBadges } from '@/components/AdvancedFilters';
export type { FilterConfig, FilterValue, FilterOperator } from '@/components/AdvancedFilters';

// Busca
export { SearchInput, SearchInputCompact } from '@/components/SearchInput';

// Ações em lote
export { BulkActionsBar, defaultBulkActions } from '@/components/BulkActionsBar';
export type { BulkAction as BulkActionUI } from '@/components/BulkActionsBar';

// Duplicação
export { DuplicateButton } from '@/components/DuplicateButton';

// Versionamento
export { VersionHistory } from '@/components/VersionHistory';

// Paginação
export { Pagination, PaginationCompact, usePagination } from '@/components/Pagination';


// ==================== UTILITÁRIOS ====================

// Import CSV
export { 
  importCSV, 
  generateCSVTemplate, 
  downloadCSVTemplate,
  commonSchemas,
  parseDataBR,
  limparDocumento,
  limparTelefone 
} from '@/lib/csvImporter';
export type { ImportResult, ImportError, ImportOptions } from '@/lib/csvImporter';

// Import Excel
export { 
  importExcel, 
  generateExcelTemplate, 
  downloadExcelTemplate,
  listExcelSheets,
  exportToExcel 
} from '@/lib/excelImporter';
export type { ExcelImportOptions } from '@/lib/excelImporter';


// ==================== TIPOS ====================

/**
 * Tipo base para entidades com ID
 */
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

/**
 * Resultado de operação paginada
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Opções de ordenação
 */
export interface SortOption<T> {
  column: keyof T;
  ascending: boolean;
}
