import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface SortableHeaderProps { label: string; sorted?: 'asc' | 'desc' | null; onSort?: () => void; }
export function SortableHeader({ label, sorted, onSort }: SortableHeaderProps) {
  return (<Button variant="ghost" onClick={onSort} className="-ml-3 h-8 gap-1">{label}{sorted === 'asc' ? <ArrowUp className="h-4 w-4" /> : sorted === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4 opacity-50" />}</Button>);
}
