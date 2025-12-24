/**
 * @fileoverview Cabeçalho da tabela
 * @module components/tables/TableHead
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TableHead as UITableHead } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface TableHeadProps {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHead = memo(function TableHead({
  children, className, sortable, sortDirection, onSort,
}: TableHeadProps) {
  const SortIcon = sortDirection === 'asc' ? ArrowUp : sortDirection === 'desc' ? ArrowDown : ArrowUpDown;
  
  return (
    <UITableHead 
      className={cn(sortable && 'cursor-pointer select-none', className)}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && <SortIcon className="h-4 w-4 text-muted-foreground" />}
      </div>
    </UITableHead>
  );
});
