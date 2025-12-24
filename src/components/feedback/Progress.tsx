/**
 * @fileoverview Componente de progresso
 * @module components/feedback/Progress
 */
import { memo } from 'react';
import { Progress as ProgressUI } from '@/components/ui/progress';

interface ProgressProps { value: number; label?: string; showPercent?: boolean; }

export const Progress = memo(function Progress({ value, label, showPercent = true }: ProgressProps) {
  return (
    <div className="space-y-1">
      {(label || showPercent) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercent && <span className="font-medium">{Math.round(value)}%</span>}
        </div>
      )}
      <ProgressUI value={value} />
    </div>
  );
});
