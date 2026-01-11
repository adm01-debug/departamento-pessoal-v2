// V15-498
import { cn } from '@/lib/utils';
interface KeyValueProps { label: string; value: React.ReactNode; className?: string; inline?: boolean; }
export function KeyValue({ label, value, className, inline }: KeyValueProps) {
  return (<div className={cn(inline ? 'flex items-center justify-between' : '', className)}><span className="text-sm text-muted-foreground">{label}</span><span className={cn('font-medium', inline ? '' : 'block')}>{value ?? '-'}</span></div>);
}
