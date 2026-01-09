import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatRowProps { label: string; value: string | number; change?: number; trend?: "up" | "down" | "neutral"; icon?: React.ReactNode; className?: string; }

export function StatRow({ label, value, change, trend: propTrend, icon, className }: StatRowProps) {
  const trend = propTrend || (change ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : undefined);
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColors = { up: "text-green-600", down: "text-red-600", neutral: "text-muted-foreground" };

  return (
    <div className={cn("flex items-center justify-between py-2", className)}>
      <div className="flex items-center gap-2">{icon}<span className="text-sm text-muted-foreground">{label}</span></div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}</span>
        {trend && change !== undefined && (
          <span className={cn("flex items-center text-sm", trendColors[trend])}><TrendIcon className="h-4 w-4 mr-0.5" />{Math.abs(change)}%</span>
        )}
      </div>
    </div>
  );
}
export default StatRow;
