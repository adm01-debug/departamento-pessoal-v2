import { cn } from '@/lib/utils';
interface SectionHeaderProps { title: string; description?: string; actions?: React.ReactNode; className?: string; }
export function SectionHeader({ title, description, actions, className }: SectionHeaderProps) {
  return (<div className={cn('flex items-center justify-between py-4 border-b', className)}><div><h2 className="text-lg font-semibold">{title}</h2>{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>{actions && <div className="flex items-center gap-2">{actions}</div>}</div>);
}
