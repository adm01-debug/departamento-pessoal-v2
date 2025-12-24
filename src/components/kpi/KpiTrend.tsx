import { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
interface KpiTrendProps { valor: number; label?: string; inverted?: boolean; }
export const KpiTrend = memo(function KpiTrend({ valor, label, inverted = false }: KpiTrendProps) {
  const isPositive = inverted ? valor < 0 : valor > 0;
  const Icon = valor > 0 ? TrendingUp : valor < 0 ? TrendingDown : Minus;
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm', isPositive ? 'text-green-600' : valor === 0 ? 'text-muted-foreground' : 'text-red-600')}>
      <Icon className="h-4 w-4" />{Math.abs(valor)}%{label && <span className="text-muted-foreground ml-1">{label}</span>}
    </span>
  );
});
