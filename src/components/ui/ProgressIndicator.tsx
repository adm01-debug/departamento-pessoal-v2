import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps { value: number; max?: number; label?: string; showPercentage?: boolean; size?: "sm" | "md" | "lg"; className?: string; }

export function ProgressIndicator({ value, max = 100, label, showPercentage = true, size = "md", className }: ProgressIndicatorProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const heightClass = { sm: "h-1", md: "h-2", lg: "h-3" };

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && <span className="font-medium">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <Progress value={percentage} className={heightClass[size]} />
    </div>
  );
}
export default ProgressIndicator;
