import { memo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/Pagination';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EntityListWrapperProps<T extends { id: string }> {
  title: string;
  icon?: React.ReactNode;
  data: T[];
  isLoading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRefresh: () => void;
  toolbar: React.ReactNode;
  children: (props: { items: T[]; selectedIds: Set<string>; toggleSelect: (id: string) => void; toggleAll: () => void; isAllSelected: boolean }) => React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

export const EntityListWrapper = memo(function EntityListWrapper<T extends { id: string }>({
  title,
  icon,
  data,
  isLoading,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  toolbar,
  children,
  emptyState,
  className,
}: EntityListWrapperProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map(item => item.id)));
    }
  }, [data, selectedIds.size]);

  const isAllSelected = selectedIds.size === data.length && data.length > 0;

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            {title}
            {total > 0 && <span className="text-sm font-normal text-muted-foreground">({total})</span>}
          </CardTitle>
        </div>
        <div className="pt-2">{toolbar}</div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          emptyState || (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum registro encontrado
            </div>
          )
        ) : (
          <>
            {children({ items: data, selectedIds, toggleSelect, toggleAll, isAllSelected })}
            
            {totalPages > 1 && (
              <div className="mt-4 pt-4 border-t">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalItems={total}
                  pageSize={pageSize}
                  onPageChange={onPageChange}
                  onPageSizeChange={onPageSizeChange}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}) as <T extends { id: string }>(props: EntityListWrapperProps<T>) => React.ReactElement;

export default EntityListWrapper;
