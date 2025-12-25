import { memo } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
interface Props { label: string; onRemove?: () => void; className?: string; }
export const Chip = memo(function Chip({ label, onRemove, className }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted text-sm', className)}>
      {label}
      {onRemove && <button onClick={onRemove} className="hover:bg-gray-300 rounded-full p-0.5"><X className="h-3 w-3" /></button>}
    </span>
  );
});
