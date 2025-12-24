/**
 * @fileoverview Loading de tabela
 * @module components/common/LoadingTable
 */
import { memo } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingTableProps { rows?: number; cols: number; }

export const LoadingTable = memo(function LoadingTable({ rows = 5, cols }: LoadingTableProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: cols }).map((_, colIdx) => (
            <TableCell key={colIdx}><Skeleton className="h-4 w-full" /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
});
