import React from "react";
import { cn } from "@/lib/utils";
interface MetricCardProps { title: string; value: string | number; subtitle?: string; icon?: React.ReactNode; trend?: { value: number; isPositive: boolean }; sparklineData?: number[]; className?: string; }
export function MetricCard({ title, value, subtitle, icon, trend, sparklineData, className }: MetricCardProps) {
  return (
    <div className={cn("p-4 rounded-lg border bg-card", className)}><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">{title}</p><p className="text-2xl font-bold mt-1">{value}</p>{subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}{trend && <div className={cn("flex items-center gap-1 mt-2 text-sm", trend.isPositive ? "text-green-600" : "text-red-600")}><span>{trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%</span><span className="text-muted-foreground">vs anterior</span></div>}</div><div className="flex flex-col items-end gap-2">{icon && <div className="p-2 rounded-lg bg-primary/10">{icon}</div>}{sparklineData && <div className="mt-2">mini</div>}</div></div></div>
  );
}
export default MetricCard;
