/**
 * @fileoverview Célula da tabela
 * @module components/tables/TableCell
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TableCell as UITableCell } from '@/components/ui/table';

/** Props do TableCell */
interface TableCellProps {
  /** Conteúdo da célula */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Alinhamento do conteúdo */
  align?: 'left' | 'center' | 'right';
  /** Colspan */
  colSpan?: number;
}

/** Mapeamento de alinhamentos */
const alignStyles: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * Célula de tabela com estilos consistentes
 * @param props - Propriedades do componente
 * @returns Elemento JSX
 */
export const TableCell = memo(function TableCell({
  children,
  className,
  align = 'left',
  colSpan,
}: TableCellProps) {
  return (
    <UITableCell
      className={cn('p-4', alignStyles[align], className)}
      colSpan={colSpan}
    >
      {children}
    </UITableCell>
  );
});
