import { memo } from "react";
import { Progress } from "@/components/ui/progress";
interface ProgressBarProps { value: number; max?: number; label?: string; }
export const ProgressBar = memo(function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      {label && <div className="flex justify-between text-sm"><span>{label}</span><span>{value}/{max}</span></div>}
      <Progress value={percent} />
    </div>
  );
});
