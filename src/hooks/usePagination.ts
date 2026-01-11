// V15-449
import { useState, useMemo } from 'react';
interface UsePaginationProps<T> { data: T[]; itemsPerPage: number; }
export function usePagination<T>({ data, itemsPerPage }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = useMemo(() => { const start = (currentPage - 1) * itemsPerPage; return data.slice(start, start + itemsPerPage); }, [data, currentPage, itemsPerPage]);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  return { currentPage, totalPages, paginatedData, goToPage, nextPage, prevPage, hasNextPage: currentPage < totalPages, hasPrevPage: currentPage > 1 };
}
