// V15-429
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
interface SummaryCardProps { title: string; value: string | number; icon: LucideIcon; description?: string; trend?: { value: number; label: string }; className?: string; }
export function SummaryCard({ title, value, icon: Icon, description, trend, className }: SummaryCardProps) {
  return (<Card className={className}><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle><Icon className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{value}</div>{description && <p className="text-xs text-muted-foreground">{description}</p>}{trend && (<p className={cn('text-xs', trend.value >= 0 ? 'text-green-600' : 'text-red-600')}>{trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}</p>)}</CardContent></Card>);
}
