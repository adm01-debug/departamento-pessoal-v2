import { cn } from '@/lib/utils';
interface DataSectionProps { title: string; children: React.ReactNode; className?: string; }
export function DataSection({ title, children, className }: DataSectionProps) {
  return (<div className={cn('space-y-4', className)}><h3 className="font-semibold text-lg border-b pb-2">{title}</h3><div className="grid gap-4 sm:grid-cols-2">{children}</div></div>);
}
