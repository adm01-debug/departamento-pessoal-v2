import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface Column<T> { key: keyof T | string; header: string; sortable?: boolean; render?: (value: any, row: T) => React.ReactNode; className?: string; width?: string; }
interface DataTableProps<T> { data: T[]; columns: Column<T>[]; loading?: boolean; searchable?: boolean; searchPlaceholder?: string; selectable?: boolean; selectedRows?: T[]; onSelectionChange?: (rows: T[]) => void; pagination?: boolean; pageSize?: number; onRowClick?: (row: T) => void; emptyMessage?: string; className?: string; stickyHeader?: boolean; striped?: boolean; hoverable?: boolean; }

export function DataTable<T extends { id?: string | number }>({ data, columns, loading = false, searchable = true, searchPlaceholder = "Buscar...", selectable = false, selectedRows = [], onSelectionChange, pagination = true, pageSize = 10, onRowClick, emptyMessage = "Nenhum dado encontrado", className, stickyHeader = false, striped = false, hoverable = true }: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => data.filter(row => columns.some(col => String(row[col.key as keyof T] || "").toLowerCase().includes(search.toLowerCase()))), [data, search, columns]);
  const sorted = useMemo(() => sortKey ? [...filtered].sort((a, b) => { const av = a[sortKey as keyof T], bv = b[sortKey as keyof T]; return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1); }) : filtered, [filtered, sortKey, sortDir]);
  const paginated = pagination ? sorted.slice(page * pageSize, (page + 1) * pageSize) : sorted;
  const totalPages = Math.ceil(sorted.length / pageSize);

  const handleSort = (key: string) => { if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(key); setSortDir("asc"); } };
  const isSelected = (row: T) => selectedRows.some(r => r.id === row.id);
  const toggleSelect = (row: T) => { const newSelection = isSelected(row) ? selectedRows.filter(r => r.id !== row.id) : [...selectedRows, row]; onSelectionChange?.(newSelection); };
  const toggleAll = () => { const allSelected = paginated.every(isSelected); onSelectionChange?.(allSelected ? [] : [...paginated]); };

  return (
    <div className={cn("space-y-4", className)}>
      {searchable && <div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder={searchPlaceholder} value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} /></div>}
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader className={stickyHeader ? "sticky top-0 bg-background z-10" : ""}>
            <TableRow>
              {selectable && <TableHead className="w-12"><Checkbox checked={paginated.length > 0 && paginated.every(isSelected)} onCheckedChange={toggleAll} /></TableHead>}
              {columns.map(col => (<TableHead key={String(col.key)} style={{ width: col.width }} className={col.className}>{col.sortable ? <Button variant="ghost" className="h-8 p-0 font-medium hover:bg-transparent" onClick={() => handleSort(String(col.key))}>{col.header}{sortKey === String(col.key) ? (sortDir === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />) : <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />}</Button> : col.header}</TableHead>))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}>{selectable && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}{columns.map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>)
            : paginated.length === 0 ? <TableRow><TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center text-muted-foreground">{emptyMessage}</TableCell></TableRow>
            : paginated.map((row, i) => (<TableRow key={row.id ?? i} className={cn(hoverable && "cursor-pointer hover:bg-muted/50", striped && i % 2 === 1 && "bg-muted/30", isSelected(row) && "bg-primary/10")} onClick={() => onRowClick?.(row)}>{selectable && <TableCell onClick={e => e.stopPropagation()}><Checkbox checked={isSelected(row)} onCheckedChange={() => toggleSelect(row)} /></TableCell>}{columns.map(col => <TableCell key={String(col.key)} className={col.className}>{col.render ? col.render(row[col.key as keyof T], row) : String(row[col.key as keyof T] ?? "-")}</TableCell>)}</TableRow>))}
          </TableBody>
        </Table>
      </div>
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{sorted.length} itens • Página {page + 1} de {totalPages}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(0)} disabled={page === 0}><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(p => p - 1)} disabled={page === 0}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default DataTable;
