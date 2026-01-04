import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Download, RefreshCw } from "lucide-react";

interface Column<T> { key: keyof T; label: string; sortable?: boolean; render?: (value: any, row: T) => React.ReactNode; className?: string; }
interface DashboardTableProps<T> { title?: string; description?: string; columns: Column<T>[]; data: T[]; loading?: boolean; searchable?: boolean; searchPlaceholder?: string; pagination?: boolean; pageSize?: number; onRowClick?: (row: T) => void; onExport?: () => void; onRefresh?: () => void; emptyMessage?: string; className?: string; }

export function DashboardTable<T extends { id?: string | number }>({ title, description, columns, data, loading = false, searchable = true, searchPlaceholder = "Buscar...", pagination = true, pageSize = 10, onRowClick, onExport, onRefresh, emptyMessage = "Nenhum dado encontrado", className }: DashboardTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = data.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase())));
  const sorted = sortKey ? [...filtered].sort((a, b) => { const av = a[sortKey], bv = b[sortKey]; return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1); }) : filtered;
  const paginated = pagination ? sorted.slice(page * pageSize, (page + 1) * pageSize) : sorted;
  const totalPages = Math.ceil(sorted.length / pageSize);

  const handleSort = (key: keyof T) => { if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(key); setSortDir("asc"); } };

  return (
    <Card className={cn("", className)}>
      {(title || searchable || onExport || onRefresh) && (
        <CardHeader className="flex flex-row items-center justify-between">
          <div>{title && <CardTitle className="text-base">{title}</CardTitle>}{description && <CardDescription>{description}</CardDescription>}</div>
          <div className="flex items-center gap-2">
            {searchable && <div className="relative"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-8 w-64" placeholder={searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} /></div>}
            {onRefresh && <Button variant="outline" size="icon" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>}
            {onExport && <Button variant="outline" size="icon" onClick={onExport}><Download className="h-4 w-4" /></Button>}
          </div>
        </CardHeader>
      )}
      <CardContent className={title || searchable ? "" : "pt-6"}>
        <Table>
          <TableHeader>
            <TableRow>{columns.map(col => (<TableHead key={String(col.key)} className={col.className}>{col.sortable ? <Button variant="ghost" className="h-auto p-0 font-medium" onClick={() => handleSort(col.key)}>{col.label}<ArrowUpDown className="ml-1 h-3 w-3" /></Button> : col.label}</TableHead>))}</TableRow>
          </TableHeader>
          <TableBody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (<TableRow key={i}>{columns.map((col, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>))
              : paginated.length === 0 ? <TableRow><TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">{emptyMessage}</TableCell></TableRow>
              : paginated.map((row, i) => (<TableRow key={row.id ?? i} className={onRowClick && "cursor-pointer hover:bg-muted/50"} onClick={() => onRowClick?.(row)}>{columns.map(col => <TableCell key={String(col.key)} className={col.className}>{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "-")}</TableCell>)}</TableRow>))}
          </TableBody>
        </Table>
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">{sorted.length} itens • Página {page + 1} de {totalPages}</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default DashboardTable;
