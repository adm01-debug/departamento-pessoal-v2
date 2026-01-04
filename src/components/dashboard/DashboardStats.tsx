import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface StatItem { label: string; value: string | number; change?: number; changeLabel?: string; icon?: LucideIcon; color?: string; }
interface DashboardStatsProps { title?: string; stats: StatItem[]; columns?: 2 | 3 | 4 | 5 | 6; className?: string; }

export function DashboardStats({ title, stats, columns = 4, className }: DashboardStatsProps) {
  const colClass = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-2 md:grid-cols-4", 5: "grid-cols-2 md:grid-cols-5", 6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6" };
  return (
    <Card className={cn("", className)}>
      {title && <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>}
      <CardContent className={title ? "" : "pt-6"}>
        <div className={cn("grid gap-4", colClass[columns])}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const TrendIcon = stat.change && stat.change > 0 ? TrendingUp : stat.change && stat.change < 0 ? TrendingDown : Minus;
            const trendColor = stat.change && stat.change > 0 ? "text-green-600" : stat.change && stat.change < 0 ? "text-red-600" : "text-gray-500";
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className={cn("h-4 w-4", stat.color || "text-muted-foreground")} />}
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  {stat.change !== undefined && (
                    <span className={cn("flex items-center text-xs", trendColor)}>
                      <TrendIcon className="h-3 w-3 mr-0.5" />{Math.abs(stat.change)}%
                    </span>
                  )}
                </div>
                {stat.changeLabel && <span className="text-xs text-muted-foreground">{stat.changeLabel}</span>}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
export default DashboardStats;
