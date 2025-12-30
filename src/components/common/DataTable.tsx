/**
 * @fileoverview Tabela de dados genérica
 * @module components/common/DataTable
 */
import { memo, type ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { NoResults } from './EmptyState';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  header: string;
  cell?: (item: T, index: number) => ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  rowClassName?: (item: T, index: number) => string;
  className?: string;
}

function DataTableComponent<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage,
  onRowClick,
  rowClassName,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <NoResults title={emptyMessage || 'Nenhum resultado encontrado'} description="Tente ajustar os filtros ou adicionar novos itens." />;
  }

  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={index}
              onClick={() => onRowClick?.(item, index)}
              className={cn(
                onRowClick && 'cursor-pointer hover:bg-muted/50',
                rowClassName?.(item, index)
              )}
            >
              {columns.map((col) => (
                <TableCell key={String(col.key)} className={col.className}>
                  {col.cell
                    ? col.cell(item, index)
                    : String(item[col.key as keyof T] ?? '-')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;
