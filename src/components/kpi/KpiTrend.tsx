/**
 * @fileoverview Tendência de KPI
 * @module components/kpi/KpiTrend
 */
import { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiTrendProps { valor: number; periodo?: string; invertido?: boolean; }

export const KpiTrend = memo(function KpiTrend({ valor, periodo, invertido = false }: KpiTrendProps) {
  const isPositive = invertido ? valor < 0 : valor > 0;
  const isNeutral = valor === 0;
  const Icon = isNeutral ? Minus : valor > 0 ? TrendingUp : TrendingDown;
  const color = isNeutral ? 'text-muted-foreground' : isPositive ? 'text-green-600' : 'text-red-600';
  return (
    <div className={cn('flex items-center gap-1 text-sm', color)}>
      <Icon className="h-4 w-4" /><span>{valor > 0 ? '+' : ''}{valor}%</span>{periodo && <span className="text-muted-foreground">vs {periodo}</span>}
    </div>
  );
});
