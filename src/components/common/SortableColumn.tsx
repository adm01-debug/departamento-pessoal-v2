import { memo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
type Dir = 'asc' | 'desc' | null;
interface Props { label: string; active?: boolean; direction?: Dir; onClick: () => void; className?: string; }
export const SortableColumn = memo(function SortableColumn({ label, active, direction, onClick, className }: Props) {
  return (
    <button onClick={onClick} className={cn('flex items-center gap-1 hover:text-foreground', active ? 'text-foreground' : 'text-muted-foreground', className)}>
      {label}
      {!active && <ArrowUpDown className="h-3 w-3" />}
      {active && direction === 'asc' && <ArrowUp className="h-3 w-3" />}
      {active && direction === 'desc' && <ArrowDown className="h-3 w-3" />}
    </button>
  );
});
