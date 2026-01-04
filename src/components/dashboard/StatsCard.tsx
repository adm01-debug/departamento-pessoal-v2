import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface StatsCardProps { title: string; value: string | number; description?: string; icon?: LucideIcon; trend?: "up" | "down" | "neutral"; trendValue?: string; color?: "blue" | "green" | "red" | "yellow" | "purple"; className?: string; onClick?: () => void; }

const colorClasses = { blue: "text-blue-600", green: "text-green-600", red: "text-red-600", yellow: "text-yellow-600", purple: "text-purple-600" };
const bgClasses = { blue: "bg-blue-50", green: "bg-green-50", red: "bg-red-50", yellow: "bg-yellow-50", purple: "bg-purple-50" };

export function StatsCard({ title, value, description, icon: Icon, trend, trendValue, color = "blue", className, onClick }: StatsCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500";
  return (
    <Card className={cn(onClick && "cursor-pointer hover:shadow-md transition-shadow", className)} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-bold", colorClasses[color])}>{value}</p>
            {trend && trendValue && <div className={cn("flex items-center text-xs", trendColor)}><TrendIcon className="h-3 w-3 mr-1" />{trendValue}</div>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {Icon && <div className={cn("p-3 rounded-lg", bgClasses[color])}><Icon className={cn("h-5 w-5", colorClasses[color])} /></div>}
        </div>
      </CardContent>
    </Card>
  );
}
export default StatsCard;
