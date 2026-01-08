import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
  format?: "number" | "currency" | "percent";
  loading?: boolean;
}

export function StatCard({ title, value, previousValue, change, changeLabel, icon, className, trend: propTrend, format = "number", loading = false }: StatCardProps) {
  const trend = propTrend || (change ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : "neutral");
  
  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val;
    switch (format) {
      case "currency": return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
      case "percent": return `${val.toFixed(1)}%`;
      default: return new Intl.NumberFormat("pt-BR").format(val);
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4" />;
      case "down": return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-8 w-8 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-20 bg-muted rounded mb-1" />
          <div className="h-4 w-16 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {(change !== undefined || previousValue !== undefined) && (
          <div className={cn("flex items-center gap-1 text-sm mt-1", getTrendColor())}>
            {getTrendIcon()}
            {change !== undefined && <span>{change > 0 ? "+" : ""}{change.toFixed(1)}%</span>}
            {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
            {previousValue !== undefined && <span className="text-muted-foreground ml-1">vs {formatValue(previousValue)}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default StatCard;
