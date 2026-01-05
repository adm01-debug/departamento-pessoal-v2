import React from "react";
import { cn } from "@/lib/utils";
interface DataGridProps<T> { data: T[]; columns: { key: keyof T | string; header: string; render?: (item: T) => React.ReactNode; className?: string }[]; keyExtractor: (item: T) => string; onRowClick?: (item: T) => void; loading?: boolean; emptyMessage?: string; }
export function DataGrid<T>({ data, columns, keyExtractor, onRowClick, loading, emptyMessage = "Nenhum registro encontrado" }: DataGridProps<T>) {
  if (loading) return <div className="py-8 text-center text-muted-foreground">Carregando...</div>;
  if (!data.length) return <div className="py-8 text-center text-muted-foreground">{emptyMessage}</div>;
  return (
    <div className="rounded-md border overflow-hidden"><table className="w-full"><thead className="bg-muted/50"><tr>{columns.map(col => <th key={String(col.key)} className={cn("px-4 py-3 text-left text-sm font-medium", col.className)}>{col.header}</th>)}</tr></thead><tbody>{data.map(item => <tr key={keyExtractor(item)} onClick={() => onRowClick?.(item)} className={cn("border-t hover:bg-muted/50 transition-colors", onRowClick && "cursor-pointer")}>{columns.map(col => <td key={String(col.key)} className={cn("px-4 py-3 text-sm", col.className)}>{col.render ? col.render(item) : String((item as any)[col.key] ?? "")}</td>)}</tr>)}</tbody></table></div>
  );
}
export default DataGrid;
