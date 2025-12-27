import { cn } from '@/lib/utils';
interface MenuGroupProps { title?: string; children: React.ReactNode; className?: string; }
export function MenuGroup({ title, children, className }: MenuGroupProps) {
  return (<div className={cn('space-y-1', className)}>{title && <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>}{children}</div>);
}
