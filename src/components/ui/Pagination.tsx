import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showTotal?: boolean;
  showFirstLast?: boolean;
  siblingCount?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({ className, currentPage, totalPages, totalItems, pageSize = 10, pageSizeOptions = [10, 20, 50, 100], showPageSize = true, showTotal = true, showFirstLast = true, siblingCount = 1, onPageChange, onPageSizeChange }: PaginationProps) {
  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const generatePages = () => {
    const totalPageNumbers = siblingCount * 2 + 3;
    if (totalPages <= totalPageNumbers) return range(1, totalPages);
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [...range(1, leftItemCount), "...", totalPages];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [1, "...", ...range(totalPages - rightItemCount + 1, totalPages)];
    }
    return [1, "...", ...range(leftSiblingIndex, rightSiblingIndex), "...", totalPages];
  };

  const pages = generatePages();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || 0);

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
      {showTotal && totalItems !== undefined && (
        <p className="text-sm text-muted-foreground">Mostrando {startItem} a {endItem} de {totalItems} itens</p>
      )}
      <div className="flex items-center gap-2">
        {showFirstLast && (
          <Button variant="outline" size="icon" onClick={() => onPageChange(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
        )}
        <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
        {pages.map((page, i) => (
          page === "..." ? (
            <span key={`dots-${i}`} className="px-2"><MoreHorizontal className="h-4 w-4" /></span>
          ) : (
            <Button key={page} variant={currentPage === page ? "default" : "outline"} size="icon" onClick={() => onPageChange(page as number)}>{page}</Button>
          )
        ))}
        <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
        {showFirstLast && (
          <Button variant="outline" size="icon" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
        )}
      </div>
      {showPageSize && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Por página:</span>
          <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>{pageSizeOptions.map(size => (<SelectItem key={size} value={String(size)}>{size}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
export default Pagination;
