import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface Column<T> { key: keyof T; label: string; sortable?: boolean; render?: (value: any, row: T) => React.ReactNode; className?: string; }
interface DataTableProps<T> { columns: Column<T>[]; data: T[]; searchable?: boolean; selectable?: boolean; onSelect?: (selected: T[]) => void; onRowClick?: (row: T) => void; className?: string; emptyMessage?: string; }

export function DataTable<T extends { id?: string | number }>({ columns, data, searchable = true, selectable = false, onSelect, onRowClick, className, emptyMessage = "Nenhum dado" }: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const filtered = useMemo(() => data.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))), [data, search]);
  const sorted = useMemo(() => sortKey ? [...filtered].sort((a, b) => { const av = a[sortKey], bv = b[sortKey]; return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1); }) : filtered, [filtered, sortKey, sortDir]);

  const handleSort = (key: keyof T) => { if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(key); setSortDir("asc"); } };
  const handleSelect = (id: string | number) => { const next = new Set(selected); if (next.has(id)) next.delete(id); else next.add(id); setSelected(next); onSelect?.(data.filter(r => next.has(r.id!))); };
  const handleSelectAll = () => { if (selected.size === data.length) { setSelected(new Set()); onSelect?.([]); } else { setSelected(new Set(data.map(r => r.id!))); onSelect?.(data); } };

  return (
    <div className={cn("space-y-4", className)}>
      {searchable && <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} /></div>}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && <TableHead className="w-12"><Checkbox checked={selected.size === data.length && data.length > 0} onCheckedChange={handleSelectAll} /></TableHead>}
              {columns.map(col => (
                <TableHead key={String(col.key)} className={col.className}>
                  {col.sortable ? <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent" onClick={() => handleSort(col.key)}>{col.label}{sortKey === col.key ? (sortDir === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />) : <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />}</Button> : col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? <TableRow><TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-8 text-muted-foreground">{emptyMessage}</TableCell></TableRow> : sorted.map((row, i) => (
              <TableRow key={row.id ?? i} className={onRowClick && "cursor-pointer"} onClick={() => onRowClick?.(row)}>
                {selectable && <TableCell><Checkbox checked={selected.has(row.id!)} onCheckedChange={() => handleSelect(row.id!)} onClick={e => e.stopPropagation()} /></TableCell>}
                {columns.map(col => <TableCell key={String(col.key)} className={col.className}>{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "-")}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
export default DataTable;
