import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  change?: number;
}

interface QuickStatsProps {
  stats: Stat[];
  className?: string;
}

export function QuickStats({ stats, className }: QuickStatsProps) {
  return (
    <div className={cn("grid gap-4", className)} style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)` }}>
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-card border rounded-lg">
          {stat.icon && <stat.icon className="h-8 w-8 text-primary" />}
          <div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            {stat.change !== undefined && (
              <p className={cn("text-xs", stat.change >= 0 ? "text-green-600" : "text-red-600")}>
                {stat.change >= 0 ? "+" : ""}{stat.change}%
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default QuickStats;
