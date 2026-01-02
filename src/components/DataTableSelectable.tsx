import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableSelectableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  isAllSelected: boolean;
  onRowClick?: (item: T) => void;
  className?: string;
}

export const DataTableSelectable = memo(function DataTableSelectable<T extends { id: string }>({
  data,
  columns,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  isAllSelected,
  onRowClick,
  className,
}: DataTableSelectableProps<T>) {
  const getValue = (item: T, key: string): unknown => {
    const keys = key.split('.');
    let value: unknown = item;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value;
  };

  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox checked={isAllSelected} onCheckedChange={onToggleAll} aria-label="Selecionar todos" />
            </TableHead>
            {columns.map((col) => (
              <TableHead key={String(col.key)} className={col.className}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className={cn('cursor-pointer hover:bg-muted/50', selectedIds.has(item.id) && 'bg-muted/30')}
              onClick={() => onRowClick?.(item)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox checked={selectedIds.has(item.id)} onCheckedChange={() => onToggleSelect(item.id)} aria-label={`Selecionar ${item.id}`} />
              </TableCell>
              {columns.map((col) => (
                <TableCell key={String(col.key)} className={col.className}>
                  {col.render ? col.render(item) : String(getValue(item, String(col.key)) ?? '-')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}) as <T extends { id: string }>(props: DataTableSelectableProps<T>) => JSX.Element;

export default DataTableSelectable;
