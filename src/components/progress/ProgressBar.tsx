import { memo } from 'react';
import { Progress } from '@/components/ui/progress';
interface ProgressBarProps { value: number; label?: string; showValue?: boolean; }
export const ProgressBar = memo(function ProgressBar({ value, label, showValue = true }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      {(label || showValue) && <div className="flex justify-between text-sm">{label && <span>{label}</span>}{showValue && <span>{Math.round(value)}%</span>}</div>}
      <Progress value={value} />
    </div>
  );
});
