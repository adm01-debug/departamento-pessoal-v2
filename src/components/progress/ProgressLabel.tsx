import { memo } from 'react';
interface ProgressLabelProps { atual: number; total: number; label?: string; }
export const ProgressLabel = memo(function ProgressLabel({ atual, total, label }: ProgressLabelProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      {label && <span className="text-muted-foreground">{label}</span>}
      <span className="font-medium">{atual} / {total}</span>
    </div>
  );
});
