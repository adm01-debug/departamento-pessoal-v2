/**
 * @fileoverview Corpo da tabela
 * @module components/tables/TableBody
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TableBody as UITableBody } from '@/components/ui/table';

interface TableBodyProps {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export const TableBody = memo(function TableBody({
  children, className, loading, emptyMessage = 'Nenhum registro encontrado', isEmpty,
}: TableBodyProps) {
  if (loading) {
    return (
      <UITableBody className={cn(className)}>
        <tr><td colSpan={100} className="h-24 text-center text-muted-foreground">Carregando...</td></tr>
      </UITableBody>
    );
  }
  if (isEmpty) {
    return (
      <UITableBody className={cn(className)}>
        <tr><td colSpan={100} className="h-24 text-center text-muted-foreground">{emptyMessage}</td></tr>
      </UITableBody>
    );
  }
  return <UITableBody className={cn(className)}>{children}</UITableBody>;
});
