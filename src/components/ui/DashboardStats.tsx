import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatItem { label: string; value: string | number; icon?: LucideIcon; color?: string; }
interface DashboardStatsProps { stats: StatItem[]; className?: string; }

export function DashboardStats({ stats, className }: DashboardStatsProps) {
  return (
    <div className={cn("flex items-center gap-6 p-4 bg-muted/50 rounded-lg", className)}>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="flex items-center gap-3">
            {Icon && <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color ? `${stat.color}20` : "hsl(var(--primary) / 0.1)" }}><Icon className="h-5 w-5" style={{ color: stat.color || "hsl(var(--primary))" }} /></div>}
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default DashboardStats;
