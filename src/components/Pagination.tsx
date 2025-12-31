import { memo, useMemo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showItemsInfo?: boolean;
  showFirstLast?: boolean;
  className?: string;
  size?: 'sm' | 'default';
}

export const Pagination = memo(function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSize = true,
  showItemsInfo = true,
  showFirstLast = true,
  className,
  size = 'default',
}: PaginationProps) {
  const fromItem = (page - 1) * pageSize + 1;
  const toItem = Math.min(page * pageSize, totalItems);

  const visiblePages = useMemo(() => {
    const delta = 2;
    const range: (number | 'ellipsis')[] = [];

    range.push(1);

    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    if (start > 2) range.push('ellipsis');

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages - 1) range.push('ellipsis');

    if (totalPages > 1) range.push(totalPages);

    return range;
  }, [page, totalPages]);

  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const buttonTextSize = size === 'sm' ? 'text-xs' : 'text-sm';

  if (totalPages <= 1 && !showPageSize) return null;

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {showItemsInfo && (
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Mostrando <span className="font-medium">{fromItem}</span> a{' '}
          <span className="font-medium">{toItem}</span> de{' '}
          <span className="font-medium">{totalItems}</span> itens
        </div>
      )}

      <div className="flex items-center gap-2 order-1 sm:order-2">
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Itens por página:
            </span>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
              <SelectTrigger className={cn('w-16', size === 'sm' && 'h-8')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-1">
          {showFirstLast && (
            <Button variant="outline" size="icon" className={buttonSize} onClick={() => onPageChange(1)} disabled={page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          <Button variant="outline" size="icon" className={buttonSize} onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {visiblePages.map((pageNum, index) =>
              pageNum === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className={cn('px-2', buttonTextSize)}>...</span>
              ) : (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="icon"
                  className={cn(buttonSize, buttonTextSize)}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          <Button variant="outline" size="icon" className={buttonSize} onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {showFirstLast && (
            <Button variant="outline" size="icon" className={buttonSize} onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

export const PaginationCompact = memo(function PaginationCompact({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground min-w-[80px] text-center">
        {page} / {totalPages}
      </span>
      <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
});

export function usePagination(totalItems: number, initialPage = 1, initialPageSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  return {
    page,
    pageSize,
    totalPages,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };
}

export default Pagination;
