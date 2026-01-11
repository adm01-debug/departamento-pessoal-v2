// V15-497
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
interface DataCardProps { title: string; value: string | number; description?: string; icon?: LucideIcon; trend?: { value: number; positive?: boolean }; className?: string; }
export function DataCard({ title, value, description, icon: Icon, trend, className }: DataCardProps) {
  return (<Card className={className}><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>{Icon && <Icon className="h-4 w-4 text-muted-foreground" />}</CardHeader><CardContent><div className="text-2xl font-bold">{value}</div>{description && <CardDescription>{description}</CardDescription>}{trend && (<p className={cn('text-xs', trend.positive !== false && trend.value >= 0 ? 'text-green-600' : 'text-red-600')}>{trend.value >= 0 ? '+' : ''}{trend.value}%</p>)}</CardContent></Card>);
}
