import React from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface Column<T> { key: keyof T | string; header: string; render?: (item: T) => React.ReactNode; width?: string; }
interface DataGridProps<T> { data: T[]; columns: Column<T>[]; keyField: keyof T; selectable?: boolean; selectedIds?: Set<string | number>; onSelectionChange?: (ids: Set<string | number>) => void; loading?: boolean; className?: string; }

export function DataGrid<T extends Record<string, any>>({ data, columns, keyField, selectable, selectedIds = new Set(), onSelectionChange, loading, className }: DataGridProps<T>) {
  const allSelected = data.length > 0 && data.every((item) => selectedIds.has(item[keyField]));
  const someSelected = data.some((item) => selectedIds.has(item[keyField]));

  const toggleAll = () => {
    if (allSelected) onSelectionChange?.(new Set());
    else onSelectionChange?.(new Set(data.map((item) => item[keyField])));
  };

  const toggleOne = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange?.(next);
  };

  if (loading) {
    return <div className={cn("space-y-2", className)}>{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {selectable && <TableHead className="w-10"><Checkbox checked={allSelected ? true : someSelected ? "indeterminate" : false} onCheckedChange={toggleAll} /></TableHead>}
          {columns.map((col) => <TableHead key={String(col.key)} style={{ width: col.width }}>{col.header}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={String(item[keyField])} data-state={selectedIds.has(item[keyField]) ? "selected" : undefined}>
            {selectable && <TableCell><Checkbox checked={selectedIds.has(item[keyField])} onCheckedChange={() => toggleOne(item[keyField])} /></TableCell>}
            {columns.map((col) => <TableCell key={String(col.key)}>{col.render ? col.render(item) : item[col.key as keyof T]}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default DataGrid;
