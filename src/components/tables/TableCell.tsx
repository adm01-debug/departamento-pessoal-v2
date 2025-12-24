/**
 * @fileoverview Célula da tabela
 * @module components/tables/TableCell
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TableCell as UITableCell } from '@/components/ui/table';

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  colSpan?: number;
}

const alignStyles: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const TableCell = memo(function TableCell({
  children, className, align = 'left', colSpan,
}: TableCellProps) {
  return (
    <UITableCell className={cn(alignStyles[align], className)} colSpan={colSpan}>
      {children}
    </UITableCell>
  );
});
