import React from "react";
import { cn } from "@/lib/utils";

interface RadialProgressProps { value: number; max?: number; size?: number; strokeWidth?: number; color?: string; label?: string; className?: string; }

export function RadialProgress({ value, max = 100, size = 120, strokeWidth = 10, color = "#3b82f6", label, className }: RadialProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-bold">{percentage.toFixed(0)}%</p>
        {label && <p className="text-xs text-muted-foreground">{label}</p>}
      </div>
    </div>
  );
}
export default RadialProgress;
