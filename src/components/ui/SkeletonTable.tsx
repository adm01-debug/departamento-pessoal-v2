import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SkeletonTableProps { rows?: number; columns?: number; className?: string; }

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>{Array.from({ length: columns }).map((_, i) => <TableHead key={i}><Skeleton className="h-4 w-20" /></TableHead>)}</TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, ri) => (
          <TableRow key={ri}>{Array.from({ length: columns }).map((_, ci) => <TableCell key={ci}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default SkeletonTable;
