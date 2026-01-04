import { useState, useMemo } from "react";
export interface PaginationResult<T> { currentPage: number; totalPages: number; pageSize: number; totalItems: number; paginatedData: T[]; goToPage: (page: number) => void; nextPage: () => void; prevPage: () => void; setPageSize: (size: number) => void; }
export function usePagination<T>(data: T[], initialPageSize: number = 10): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = useMemo(() => { const start = (currentPage - 1) * pageSize; return data.slice(start, start + pageSize); }, [data, currentPage, pageSize]);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const setPageSize = (size: number) => { setPageSizeState(size); setCurrentPage(1); };
  return { currentPage, totalPages, pageSize, totalItems: data.length, paginatedData, goToPage, nextPage, prevPage, setPageSize };
}
export default usePagination;
