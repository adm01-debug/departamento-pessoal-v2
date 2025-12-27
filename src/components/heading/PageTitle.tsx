import { cn } from '@/lib/utils';
interface PageTitleProps { children: React.ReactNode; description?: string; className?: string; }
export function PageTitle({ children, description, className }: PageTitleProps) {
  return (<div className={cn('space-y-1', className)}><h1 className="text-2xl font-bold tracking-tight">{children}</h1>{description && <p className="text-muted-foreground">{description}</p>}</div>);
}
