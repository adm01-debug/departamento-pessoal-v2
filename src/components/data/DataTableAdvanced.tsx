import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
interface Column<T> { key: keyof T; header: string; sortable?: boolean; render?: (value: T[keyof T], row: T) => React.ReactNode; }
interface DataTableAdvancedProps<T> { data: T[]; columns: Column<T>[]; searchable?: boolean; searchPlaceholder?: string; }
export function DataTableAdvanced<T extends Record<string, any>>({ data, columns, searchable = true, searchPlaceholder = 'Buscar...' }: DataTableAdvancedProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const filtered = useMemo(() => {
    let result = [...data];
    if (search) result = result.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase())));
    if (sortKey) result.sort((a, b) => { const aVal = a[sortKey], bVal = b[sortKey]; const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0; return sortDir === 'asc' ? cmp : -cmp; });
    return result;
  }, [data, search, sortKey, sortDir]);
  const handleSort = (key: keyof T) => { if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };
  return (<div className="space-y-4">{searchable && <div className="relative"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder={searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} className="pl-8" /></div>}<Table><TableHeader><TableRow>{columns.map(col => <TableHead key={String(col.key)}>{col.sortable ? <Button variant="ghost" onClick={() => handleSort(col.key)} className="h-auto p-0 font-medium">{col.header}{sortKey === col.key && (sortDir === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}</Button> : col.header}</TableHead>)}</TableRow></TableHeader><TableBody>{filtered.map((row, i) => <TableRow key={i}>{columns.map(col => <TableCell key={String(col.key)}>{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}</TableCell>)}</TableRow>)}</TableBody></Table></div>);
}
