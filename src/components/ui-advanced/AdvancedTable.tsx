import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, Search, Download, Filter } from "lucide-react";
interface Column<T> { key: keyof T; label: string; sortable?: boolean; render?: (value: any, row: T) => React.ReactNode; }
interface Props<T> { data: T[]; columns: Column<T>[]; onRowClick?: (row: T) => void; searchable?: boolean; exportable?: boolean; }
export function AdvancedTable<T extends Record<string, any>>({ data, columns, onRowClick, searchable = true, exportable = true }: Props<T>) {
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const filtered = data.filter(row => columns.some(col => String(row[col.key]).toLowerCase().includes(search.toLowerCase())));
  const sorted = sortKey ? [...filtered].sort((a, b) => { const aVal = a[sortKey], bVal = b[sortKey]; return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1); }) : filtered;
  const handleSort = (key: keyof T) => { if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(key); setSortDir("asc"); } };
  return (<div className="space-y-4"><div className="flex gap-2">{searchable && <div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>}{exportable && <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Exportar</Button>}</div><Table><TableHeader><TableRow>{columns.map(col => <TableHead key={String(col.key)} onClick={() => col.sortable && handleSort(col.key)} className={col.sortable ? "cursor-pointer" : ""}>{col.label}{sortKey === col.key && (sortDir === "asc" ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}</TableHead>)}</TableRow></TableHeader><TableBody>{sorted.map((row, i) => <TableRow key={i} onClick={() => onRowClick?.(row)} className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}>{columns.map(col => <TableCell key={String(col.key)}>{col.render ? col.render(row[col.key], row) : String(row[col.key])}</TableCell>)}</TableRow>)}</TableBody></Table></div>);
}
export default AdvancedTable;
