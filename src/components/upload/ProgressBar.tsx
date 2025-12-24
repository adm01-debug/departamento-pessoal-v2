import { memo } from "react";
import { Progress } from "@/components/ui/progress";
interface ProgressBarProps { value: number; fileName?: string; }
export const ProgressBar = memo(function ProgressBar({ value, fileName }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      {fileName && <p className="text-sm truncate">{fileName}</p>}
      <Progress value={value} />
      <p className="text-xs text-right text-muted-foreground">{Math.round(value)}%</p>
    </div>
  );
});
