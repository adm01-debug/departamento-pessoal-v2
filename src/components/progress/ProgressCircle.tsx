import { memo } from 'react';
interface ProgressCircleProps { value: number; size?: number; strokeWidth?: number; }
export const ProgressCircle = memo(function ProgressCircle({ value, size = 80, strokeWidth = 8 }: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} className="text-primary transition-all" />
      </svg>
      <span className="absolute text-sm font-medium">{Math.round(value)}%</span>
    </div>
  );
});
