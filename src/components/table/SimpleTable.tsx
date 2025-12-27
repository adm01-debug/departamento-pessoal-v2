import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
interface Column<T> { key: keyof T | string; header: string; render?: (item: T) => React.ReactNode; }
interface SimpleTableProps<T> { data: T[]; columns: Column<T>[]; onRowClick?: (item: T) => void; }
export function SimpleTable<T extends { id?: string | number }>({ data, columns, onRowClick }: SimpleTableProps<T>) {
  return (<Table><TableHeader><TableRow>{columns.map(col => <TableHead key={String(col.key)}>{col.header}</TableHead>)}</TableRow></TableHeader><TableBody>{data.map((item, i) => (<TableRow key={item.id ?? i} onClick={() => onRowClick?.(item)} className={onRowClick ? 'cursor-pointer hover:bg-muted' : ''}>{columns.map(col => <TableCell key={String(col.key)}>{col.render ? col.render(item) : String((item as any)[col.key] ?? '')}</TableCell>)}</TableRow>))}</TableBody></Table>);
}
