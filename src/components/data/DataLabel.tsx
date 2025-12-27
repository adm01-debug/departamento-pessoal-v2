import { cn } from '@/lib/utils';
interface DataLabelProps { label: string; value: React.ReactNode; className?: string; horizontal?: boolean; }
export function DataLabel({ label, value, className, horizontal = false }: DataLabelProps) {
  return (<div className={cn('flex', horizontal ? 'flex-row items-center gap-2' : 'flex-col gap-1', className)}><span className="text-sm text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>);
}
