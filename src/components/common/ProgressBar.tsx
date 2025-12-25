import { memo } from 'react';
import { cn } from '@/lib/utils';
interface Props { value: number; max?: number; showLabel?: boolean; className?: string; color?: 'default' | 'success' | 'warning' | 'error'; }
const colors = { default: 'bg-primary', success: 'bg-green-500', warning: 'bg-yellow-500', error: 'bg-red-500' };
export const ProgressBar = memo(function ProgressBar({ value, max = 100, showLabel = false, className, color = 'default' }: Props) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={cn('h-2 rounded-full transition-all', colors[color])} style={{ width: `${percent}%` }} />
      </div>
      {showLabel && <span className="text-xs text-muted-foreground mt-1">{percent.toFixed(0)}%</span>}
    </div>
  );
});
