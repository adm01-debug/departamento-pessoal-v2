/**
 * @fileoverview Lista de dados genérica
 * @module components/data/DataList
 */
import { memo } from 'react';
import { DataEmpty } from './DataEmpty';
import { cn } from '@/lib/utils';

interface DataListProps<T> { data: T[]; renderItem: (item: T, index: number) => React.ReactNode; emptyMessage?: string; className?: string; }

export const DataList = memo(function DataList<T>({ data, renderItem, emptyMessage, className }: DataListProps<T>) {
  if (data.length === 0) return <DataEmpty titulo={emptyMessage} />;
  return <div className={cn('space-y-2', className)}>{data.map((item, idx) => renderItem(item, idx))}</div>;
}) as <T>(props: DataListProps<T>) => React.ReactElement;
