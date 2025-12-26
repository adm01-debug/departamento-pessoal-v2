import { useState, useMemo } from 'react';
export function useDataGrid<T>(data: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const paginatedData = useMemo(() => data.slice((page - 1) * pageSize, page * pageSize), [data, page, pageSize]);
  return { data: paginatedData, page, setPage, sortField, setSortField, sortOrder, setSortOrder, filters, setFilters, totalPages: Math.ceil(data.length / pageSize) };
}
