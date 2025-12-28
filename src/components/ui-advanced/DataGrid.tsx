/**
 * @fileoverview DataGrid Avançado com funcionalidades completas
 * @version V8.0 - Implementação REAL
 */
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Search, Filter, Download,
  MoreVertical, Check, X, Edit, Trash, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TIPOS
// ============================================

export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: { label: string; value: string }[];
}

export interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  selectable?: boolean;
  singleSelect?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  rowActions?: (row: T) => React.ReactNode;
  expandable?: boolean;
  expandedRowRender?: (row: T) => React.ReactNode;
  serverSide?: boolean;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  exportable?: boolean;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  emptyMessage?: string;
  stickyHeader?: boolean;
  resizableColumns?: boolean;
  reorderableColumns?: boolean;
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  getRowId?: (row: T) => string | number;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function DataGrid<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  loading = false,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  selectable = false,
  singleSelect = false,
  onSelectionChange,
  onRowClick,
  onRowDoubleClick,
  rowActions,
  expandable = false,
  expandedRowRender,
  serverSide = false,
  totalRecords,
  onPageChange,
  onSortChange,
  onFilterChange,
  exportable = false,
  onExport,
  emptyMessage = 'Nenhum registro encontrado',
  stickyHeader = true,
  resizableColumns = false,
  reorderableColumns = false,
  className,
  rowClassName,
  getRowId = (row) => (row as any).id || Math.random(),
}: DataGridProps<T>) {
  // Estados
  const [columns, setColumns] = useState(initialColumns);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [showFilters, setShowFilters] = useState(false);

  const tableRef = useRef<HTMLTableElement>(null);
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  // Dados processados (filtro, ordenação, paginação)
  const processedData = useMemo(() => {
    if (serverSide) return data;

    let result = [...data];

    // Filtro global
    if (globalSearch) {
      const searchLower = globalSearch.toLowerCase();
      result = result.filter(row =>
        columns.some(col => {
          const value = typeof col.accessor === 'function' 
            ? col.accessor(row) 
            : row[col.accessor];
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Filtros por coluna
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        result = result.filter(row => {
          const col = columns.find(c => c.id === key);
          if (!col) return true;
          const cellValue = typeof col.accessor === 'function'
            ? col.accessor(row)
            : row[col.accessor as keyof T];
          return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
        });
      }
    });

    // Ordenação
    if (sortBy) {
      const col = columns.find(c => c.id === sortBy);
      if (col) {
        result.sort((a, b) => {
          const aVal = typeof col.accessor === 'function' ? col.accessor(a) : a[col.accessor as keyof T];
          const bVal = typeof col.accessor === 'function' ? col.accessor(b) : b[col.accessor as keyof T];
          
          if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }

    return result;
  }, [data, columns, globalSearch, filters, sortBy, sortOrder, serverSide]);

  // Paginação
  const totalItems = serverSide ? (totalRecords || 0) : processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = serverSide ? processedData : processedData.slice(startIndex, endIndex);

  // Handlers
  const handleSort = useCallback((columnId: string) => {
    const col = columns.find(c => c.id === columnId);
    if (!col?.sortable) return;

    const newOrder = sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(columnId);
    setSortOrder(newOrder);
    onSortChange?.(columnId, newOrder);
  }, [columns, sortBy, sortOrder, onSortChange]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  }, [onPageChange]);

  const handleFilterChange = useCallback((columnId: string, value: any) => {
    const newFilters = { ...filters, [columnId]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    onFilterChange?.(newFilters);
  }, [filters, onFilterChange]);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const newSelected = new Set(paginatedData.map(row => getRowId(row)));
      setSelectedRows(newSelected);
      onSelectionChange?.(paginatedData);
    }
  }, [paginatedData, selectedRows, getRowId, onSelectionChange]);

  const handleSelectRow = useCallback((row: T) => {
    const rowId = getRowId(row);
    const newSelected = new Set(selectedRows);
    
    if (singleSelect) {
      if (newSelected.has(rowId)) {
        newSelected.clear();
      } else {
        newSelected.clear();
        newSelected.add(rowId);
      }
    } else {
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
    }
    
    setSelectedRows(newSelected);
    onSelectionChange?.(data.filter(r => newSelected.has(getRowId(r))));
  }, [data, selectedRows, singleSelect, getRowId, onSelectionChange]);

  const handleExpandRow = useCallback((row: T) => {
    const rowId = getRowId(row);
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  }, [expandedRows, getRowId]);

  // Exportar
  const handleExport = useCallback((format: 'csv' | 'excel' | 'pdf') => {
    if (onExport) {
      onExport(format);
      return;
    }

    if (format === 'csv') {
      const headers = columns.map(c => c.header).join(',');
      const rows = processedData.map(row =>
        columns.map(col => {
          const value = typeof col.accessor === 'function' 
            ? col.accessor(row) 
            : row[col.accessor as keyof T];
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      );
      const csv = [headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `export_${new Date().toISOString()}.csv`;
      link.click();
    }
  }, [columns, processedData, onExport]);

  // Resize de colunas
  const handleResizeStart = useCallback((e: React.MouseEvent, columnId: string) => {
    if (!resizableColumns) return;
    resizingColumn.current = columnId;
    startX.current = e.clientX;
    startWidth.current = columnWidths[columnId] || 150;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingColumn.current) return;
      const diff = e.clientX - startX.current;
      const newWidth = Math.max(50, startWidth.current + diff);
      setColumnWidths(prev => ({ ...prev, [resizingColumn.current!]: newWidth }));
    };

    const handleMouseUp = () => {
      resizingColumn.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [resizableColumns, columnWidths]);

  // Render de célula
  const renderCell = useCallback((row: T, column: Column<T>, index: number) => {
    const value = typeof column.accessor === 'function' 
      ? column.accessor(row) 
      : row[column.accessor as keyof T];
    
    if (column.render) {
      return column.render(value, row, index);
    }
    
    return String(value ?? '');
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-2 border rounded-md hover:bg-muted',
              showFilters && 'bg-muted'
            )}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
        
        {exportable && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
          </div>
        )}
      </div>

      {/* Filtros por coluna */}
      {showFilters && (
        <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-muted/50 rounded-md">
          {columns.filter(c => c.filterable).map(column => (
            <div key={column.id}>
              <label className="text-sm font-medium">{column.header}</label>
              <input
                type={column.filterType === 'number' ? 'number' : 'text'}
                value={filters[column.id] || ''}
                onChange={(e) => handleFilterChange(column.id, e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder={`Filtrar ${column.header}...`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tabela */}
      <div className="border rounded-md overflow-auto">
        <table ref={tableRef} className="w-full">
          <thead className={cn(stickyHeader && 'sticky top-0 bg-background z-10')}>
            <tr className="border-b bg-muted/50">
              {selectable && (
                <th className="w-12 p-3">
                  {!singleSelect && (
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  )}
                </th>
              )}
              {expandable && <th className="w-12 p-3" />}
              {columns.map(column => (
                <th
                  key={column.id}
                  className={cn(
                    'p-3 text-left font-medium',
                    column.sortable && 'cursor-pointer hover:bg-muted',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ 
                    width: columnWidths[column.id] || column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                  }}
                  onClick={() => handleSort(column.id)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && sortBy === column.id && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                  {resizableColumns && (
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary"
                      onMouseDown={(e) => handleResizeStart(e, column.id)}
                    />
                  )}
                </th>
              ))}
              {rowActions && <th className="w-20 p-3">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (rowActions ? 1 : 0)} className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Carregando...
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (rowActions ? 1 : 0)} className="p-8 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = getRowId(row);
                const isSelected = selectedRows.has(rowId);
                const isExpanded = expandedRows.has(rowId);
                
                return (
                  <React.Fragment key={rowId}>
                    <tr
                      className={cn(
                        'border-b hover:bg-muted/50 transition-colors',
                        isSelected && 'bg-primary/10',
                        typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName
                      )}
                      onClick={() => onRowClick?.(row, index)}
                      onDoubleClick={() => onRowDoubleClick?.(row, index)}
                    >
                      {selectable && (
                        <td className="p-3">
                          <input
                            type={singleSelect ? 'radio' : 'checkbox'}
                            checked={isSelected}
                            onChange={() => handleSelectRow(row)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded"
                          />
                        </td>
                      )}
                      {expandable && (
                        <td className="p-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleExpandRow(row); }}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </td>
                      )}
                      {columns.map(column => (
                        <td
                          key={column.id}
                          className={cn(
                            'p-3',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {renderCell(row, column, index)}
                        </td>
                      ))}
                      {rowActions && (
                        <td className="p-3">
                          {rowActions(row)}
                        </td>
                      )}
                    </tr>
                    {expandable && isExpanded && expandedRowRender && (
                      <tr className="bg-muted/30">
                        <td colSpan={columns.length + (selectable ? 1 : 0) + 1 + (rowActions ? 1 : 0)} className="p-4">
                          {expandedRowRender(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} registros
          </span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="border rounded-md px-2 py-1"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size} por página</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 border rounded-md hover:bg-muted disabled:opacity-50"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded-md hover:bg-muted disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="px-4 py-2">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-md hover:bg-muted disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-md hover:bg-muted disabled:opacity-50"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataGrid;
