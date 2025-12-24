/**
 * @fileoverview Comparação de KPI
 * @module components/kpi/KpiComparison
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface KpiComparisonProps { atual: number; anterior: number; label?: string; formato?: (v: number) => string; }

export const KpiComparison = memo(function KpiComparison({ atual, anterior, label, formato = v => v.toString() }: KpiComparisonProps) {
  const diff = atual - anterior;
  const percent = anterior !== 0 ? ((diff / anterior) * 100).toFixed(1) : '0';
  const isPositive = diff >= 0;
  return (
    <div className="space-y-1">
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold">{formato(atual)}</span>
        <span className={cn('text-sm', isPositive ? 'text-green-600' : 'text-red-600')}>{isPositive ? '+' : ''}{percent}%</span>
      </div>
      <p className="text-xs text-muted-foreground">vs {formato(anterior)} anterior</p>
    </div>
  );
});
