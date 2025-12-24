/**
 * @fileoverview Linha da tabela
 * @module components/tables/TableRow
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TableRow as UITableRow } from '@/components/ui/table';

interface TableRowProps {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
}

export const TableRow = memo(function TableRow({
  children, className, selected, onClick, hoverable = true,
}: TableRowProps) {
  return (
    <UITableRow 
      className={cn(
        hoverable && 'hover:bg-muted/50',
        selected && 'bg-muted',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </UITableRow>
  );
});
