import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ProgressRowProps { label: string; value: number; max?: number; showPercentage?: boolean; color?: string; className?: string; }

export function ProgressRow({ label, value, max = 100, showPercentage = true, color, className }: ProgressRowProps) {
  const percentage = (value / max) * 100;
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{showPercentage ? `${percentage.toFixed(0)}%` : `${value}/${max}`}</span>
      </div>
      <Progress value={percentage} className="h-2" style={color ? { "--progress-color": color } as any : undefined} />
    </div>
  );
}
export default ProgressRow;
