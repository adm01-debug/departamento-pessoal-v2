import { cn } from '@/lib/utils';
interface DataDisplayProps { label: string; value: React.ReactNode; className?: string; }
export function DataDisplay({ label, value, className }: DataDisplayProps) {
  return (<div className={cn('space-y-1', className)}><dt className="text-sm font-medium text-muted-foreground">{label}</dt><dd className="text-sm">{value || '-'}</dd></div>);
}
