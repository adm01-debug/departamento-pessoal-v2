/**
 * @fileoverview Progresso de KPI
 * @module components/kpi/KpiProgress
 */
import { memo } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface KpiProgressProps { label: string; valor: number; meta: number; formato?: (v: number) => string; }

export const KpiProgress = memo(function KpiProgress({ label, valor, meta, formato = v => v.toString() }: KpiProgressProps) {
  const percent = Math.min((valor / meta) * 100, 100);
  const atingido = valor >= meta;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm"><span>{label}</span><span className={cn(atingido ? 'text-green-600' : 'text-muted-foreground')}>{formato(valor)} / {formato(meta)}</span></div>
      <Progress value={percent} className={cn(atingido && '[&>div]:bg-green-500')} />
    </div>
  );
});
