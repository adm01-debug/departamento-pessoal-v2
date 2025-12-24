/**
 * @fileoverview Estado vazio de tabela
 * @module components/common/EmptyTable
 */
import { memo } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Inbox } from 'lucide-react';

interface EmptyTableProps { colSpan: number; message?: string; }

export const EmptyTable = memo(function EmptyTable({ colSpan, message = 'Nenhum registro encontrado' }: EmptyTableProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <Inbox className="h-10 w-10 mb-2 opacity-50" />
          <p>{message}</p>
        </div>
      </TableCell>
    </TableRow>
  );
});
