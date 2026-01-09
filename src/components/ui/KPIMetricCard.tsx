import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface KPIMetricCardProps { title: string; value: string | number; change?: number; changeLabel?: string; icon?: LucideIcon; iconColor?: string; className?: string; }

export function KPIMetricCard({ title, value, change, changeLabel, icon: Icon, iconColor = "text-primary", className }: KPIMetricCardProps) {
  const TrendIcon = change && change > 0 ? TrendingUp : change && change < 0 ? TrendingDown : Minus;
  const trendColor = change && change > 0 ? "text-green-600" : change && change < 0 ? "text-red-600" : "text-muted-foreground";

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {change !== undefined && (
              <div className={cn("flex items-center gap-1 mt-2 text-sm", trendColor)}>
                <TrendIcon className="h-4 w-4" />
                <span>{Math.abs(change)}%</span>
                {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
              </div>
            )}
          </div>
          {Icon && <div className={cn("h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center", iconColor)}><Icon className="h-6 w-6" /></div>}
        </div>
      </CardContent>
    </Card>
  );
}
export default KPIMetricCard;
