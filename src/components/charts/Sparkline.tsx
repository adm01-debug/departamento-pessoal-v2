import React from "react";
import { cn } from "@/lib/utils";
interface SparklineProps { data: number[]; width?: number; height?: number; color?: string; fillOpacity?: number; showArea?: boolean; className?: string; }
export function Sparkline({ data, width = 100, height = 30, color = "hsl(var(--primary))", fillOpacity = 0.2, showArea = true, className }: SparklineProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => { const x = (i / (data.length - 1)) * width; const y = height - ((val - min) / range) * height; return `${x},${y}`; }).join(" ");
  const areaPath = `M0,${height} L${points} L${width},${height} Z`;
  return (
    <svg width={width} height={height} className={className}>{showArea && <path d={areaPath} fill={color} fillOpacity={fillOpacity} />}<polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
export default Sparkline;
