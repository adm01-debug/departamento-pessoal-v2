import React from "react";
import { cn } from "@/lib/utils";

interface MetricStatCardProps { label: string; value: string | number; change?: number; icon?: React.ReactNode; className?: string; }

export function MetricStatCard({ label, value, change, icon, className }: MetricStatCardProps) {
  return (
    <div className={cn("p-4 border rounded-lg", className)}>
      <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span>{icon}</div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {change !== undefined && <p className={cn("text-sm mt-1", change >= 0 ? "text-green-600" : "text-red-600")}>{change >= 0 ? "+" : ""}{change}%</p>}
    </div>
  );
}
export default MetricStatCard;
