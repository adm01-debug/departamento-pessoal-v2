import { cn } from '@/lib/utils';
interface ActionBarProps { children: React.ReactNode; className?: string; sticky?: boolean; }
export function ActionBar({ children, className, sticky = false }: ActionBarProps) {
  return (<div className={cn('flex items-center justify-between gap-4 p-4 bg-background border rounded-lg', sticky && 'sticky bottom-4 shadow-lg', className)}>{children}</div>);
}
