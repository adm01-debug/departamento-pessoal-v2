import { cn } from '@/lib/utils';
interface ScaleInProps { children: React.ReactNode; delay?: number; duration?: number; className?: string; }
export function ScaleIn({ children, delay = 0, duration = 300, className }: ScaleInProps) {
  return (<div className={cn('animate-in zoom-in', className)} style={{ animationDelay: `${delay}ms`, animationDuration: `${duration}ms` }}>{children}</div>);
}
