/**
 * @fileoverview Cabeçalho da tabela
 * @module components/tables/TableHead
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TableHeader as UITableHeader, TableRow, TableHead as UITableHead } from '@/components/ui/table';

/** Props do TableHead */
interface TableHeadProps {
  /** Células do cabeçalho */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Se é sticky */
  sticky?: boolean;
}

/**
 * Cabeçalho da tabela
 * @param props - Propriedades do componente
 * @returns Elemento JSX
 */
export const TableHead = memo(function TableHead({
  children,
  className,
  sticky = false,
}: TableHeadProps) {
  return (
    <UITableHeader
      className={cn(
        'bg-muted/50',
        sticky && 'sticky top-0 z-10',
        className
      )}
    >
      <TableRow>
        {children}
      </TableRow>
    </UITableHeader>
  );
});

/** Props do HeaderCell */
interface HeaderCellProps {
  /** Conteúdo */
  children: ReactNode;
  /** Classes CSS */
  className?: string;
  /** Alinhamento */
  align?: 'left' | 'center' | 'right';
}

/** Célula de cabeçalho */
export const HeaderCell = memo(function HeaderCell({
  children,
  className,
  align = 'left',
}: HeaderCellProps) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return (
    <UITableHead className={cn('h-12 px-4 font-medium', alignClass, className)}>
      {children}
    </UITableHead>
  );
});
