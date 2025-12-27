import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
interface TagProps { label: string; onRemove?: () => void; variant?: 'default' | 'primary' | 'secondary'; className?: string; }
const variants = { default: 'bg-muted text-muted-foreground', primary: 'bg-primary/10 text-primary', secondary: 'bg-secondary text-secondary-foreground' };
export function Tag({ label, onRemove, variant = 'default', className }: TagProps) {
  return (<span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>{label}{onRemove && <button onClick={onRemove} className="hover:bg-black/10 rounded-full p-0.5"><X className="h-3 w-3" /></button>}</span>);
}
