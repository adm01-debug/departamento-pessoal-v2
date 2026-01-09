import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  format?: "number" | "currency" | "percent";
  className?: string;
  loading?: boolean;
}

export function MetricCard({ title, value, previousValue, change, icon, trend: propTrend, format = "number", className, loading = false }: MetricCardProps) {
  const trend = propTrend || (change ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : "neutral");
  const trendColors = { up: "text-green-600", down: "text-red-600", neutral: "text-muted-foreground" };
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val;
    if (format === "currency") return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    if (format === "percent") return `${val.toFixed(1)}%`;
    return new Intl.NumberFormat("pt-BR").format(val);
  };

  if (loading) return <Card className={cn("animate-pulse", className)}><CardContent className="pt-6"><div className="h-4 w-24 bg-muted rounded mb-2" /><div className="h-8 w-20 bg-muted rounded" /></CardContent></Card>;

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          {icon && <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">{icon}</div>}
        </div>
        <p className="text-2xl font-bold mt-2">{formatValue(value)}</p>
        {(change !== undefined || previousValue) && (
          <div className={cn("flex items-center gap-1 text-sm mt-1", trendColors[trend])}>
            <TrendIcon className="h-4 w-4" />
            {change !== undefined && <span>{change > 0 ? "+" : ""}{change.toFixed(1)}%</span>}
            {previousValue && <span className="text-muted-foreground">vs {formatValue(previousValue)}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default MetricCard;
