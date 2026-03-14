/**
 * @fileoverview Tabela ordenável
 * @module components/common/SortableTable
 */
import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Column<T> { key: keyof T; label: string; sortable?: boolean; render?: (item: T) => React.ReactNode; }
interface SortableTableProps<T> { columns: Column<T>[]; data: T[]; sortKey?: keyof T; sortDir?: 'asc' | 'desc'; onSort?: (key: keyof T) => void; }

export const SortableTable = memo(function SortableTable<T extends { id: string }>({ columns, data, sortKey, sortDir, onSort }: SortableTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(col => (
            <TableHead key={String(col.key)}>
              {col.sortable && onSort ? (
                <Button variant="ghost" size="sm" onClick={() => onSort(col.key)}>
                  {col.label}
                  {sortKey === col.key ? (sortDir === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />) : <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </Button>
              ) : col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(item => (
          <TableRow key={item.id}>
            {columns.map(col => <TableCell key={String(col.key)}>{col.render ? col.render(item) : String(item[col.key])}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}) as <T extends { id: string }>(props: SortableTableProps<T>) => React.ReactElement;
