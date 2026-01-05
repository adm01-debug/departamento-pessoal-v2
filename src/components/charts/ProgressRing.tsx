import React from "react";
import { cn } from "@/lib/utils";
interface ProgressRingProps { value: number; max?: number; size?: number; strokeWidth?: number; color?: string; bgColor?: string; label?: string; showPercentage?: boolean; }
export function ProgressRing({ value, max = 100, size = 120, strokeWidth = 10, color = "hsl(var(--primary))", bgColor = "hsl(var(--muted))", label, showPercentage = true }: ProgressRingProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}><svg width={size} height={size} className="-rotate-90"><circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} /><circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" /></svg><div className="absolute flex flex-col items-center justify-center">{showPercentage && <span className="text-xl font-bold">{Math.round(percentage)}%</span>}{label && <span className="text-xs text-muted-foreground">{label}</span>}</div></div>
  );
}
export default ProgressRing;
