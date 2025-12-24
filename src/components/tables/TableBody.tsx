/**
 * @fileoverview Corpo da tabela
 * @module components/tables/TableBody
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TableBody as UITableBody } from '@/components/ui/table';

/** Props do TableBody */
interface TableBodyProps {
  /** Linhas da tabela */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Corpo da tabela para exibir dados
 * @param props - Propriedades do componente
 * @returns Elemento JSX
 */
export const TableBody = memo(function TableBody({
  children,
  className,
}: TableBodyProps) {
  return (
    <UITableBody className={cn('[&_tr:last-child]:border-0', className)}>
      {children}
    </UITableBody>
  );
});
