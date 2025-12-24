/**
 * @fileoverview Grid de métricas do dashboard
 * @module components/dashboard/MetricsGrid
 */
import { memo } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Metric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color?: string;
}

interface MetricsGridProps {
  /** Lista de métricas */
  metrics: Metric[];
  /** Número de colunas */
  columns?: 2 | 3 | 4;
}

/**
 * Grid responsivo de métricas com indicadores de tendência
 * @param props - Propriedades do componente
 * @returns Grid de cards de métricas
 */
export const MetricsGrid = memo(function MetricsGrid({ metrics, columns = 4 }: MetricsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const getTrendIcon = (change?: number) => {
    if (!change) return Minus;
    return change > 0 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (change?: number) => {
    if (!change) return 'text-muted-foreground';
    return change > 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns])}>
      {metrics.map((metric) => {
        const TrendIcon = getTrendIcon(metric.change);
        const Icon = metric.icon;
        return (
          <div
            key={metric.id}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <Icon className={cn('h-5 w-5', metric.color || 'text-primary')} />
              {metric.change !== undefined && (
                <div className={cn('flex items-center gap-1 text-xs', getTrendColor(metric.change))}>
                  <TrendIcon className="h-3 w-3" />
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

