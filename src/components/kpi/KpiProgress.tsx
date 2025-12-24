import { memo } from 'react';
import { Progress } from '@/components/ui/progress';
interface KpiProgressProps { label: string; atual: number; meta: number; formato?: (v: number) => string; }
export const KpiProgress = memo(function KpiProgress({ label, atual, meta, formato = v => String(v) }: KpiProgressProps) {
  const percent = meta > 0 ? Math.min(100, Math.round((atual / meta) * 100)) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{formato(atual)} / {formato(meta)}</span>
      </div>
      <Progress value={percent} />
      <p className="text-xs text-muted-foreground text-right">{percent}% da meta</p>
    </div>
  );
});
