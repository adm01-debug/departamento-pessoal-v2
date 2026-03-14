/**
 * @fileoverview Grid de dados
 * @module components/data/DataGrid
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface DataGridProps<T> { data: T[]; columns: number; renderItem: (item: T, index: number) => React.ReactNode; gap?: number; className?: string; }

export const DataGrid = memo(function DataGrid<T>({ data, columns, renderItem, gap = 4, className }: DataGridProps<T>) {
  return (
    <div className={cn(`grid gap-${gap}`, className)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {data.map((item, idx) => renderItem(item, idx))}
    </div>
  );
}) as <T>(props: DataGridProps<T>) => React.ReactElement;
