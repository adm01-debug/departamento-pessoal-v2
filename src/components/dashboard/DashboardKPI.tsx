import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardKPIProps {
  title: string;
  value: string | number;
  previousValue?: number;
  currentValue?: number;
  format?: "number" | "currency" | "percentage";
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  trendLabel?: string;
  icon?: LucideIcon;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  tooltip?: string;
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  green: "bg-green-50 text-green-600 border-green-200",
  red: "bg-red-50 text-red-600 border-red-200",
  yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  gray: "bg-gray-50 text-gray-600 border-gray-200",
};

const iconBgClasses = {
  blue: "bg-blue-100", green: "bg-green-100", red: "bg-red-100",
  yellow: "bg-yellow-100", purple: "bg-purple-100", gray: "bg-gray-100",
};

const sizeClasses = {
  sm: { value: "text-xl", icon: "h-8 w-8 p-1.5" },
  md: { value: "text-2xl", icon: "h-10 w-10 p-2" },
  lg: { value: "text-3xl", icon: "h-12 w-12 p-2.5" },
};

export function DashboardKPI({
  title, value, previousValue, currentValue, format = "number", trend, trendValue, trendLabel,
  icon: Icon, color = "blue", loading = false, size = "md", className, onClick, tooltip
}: DashboardKPIProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500";

  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val;
    switch (format) {
      case "currency": return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
      case "percentage": return `${val.toFixed(1)}%`;
      default: return new Intl.NumberFormat("pt-BR").format(val);
    }
  };

  const calculateTrend = () => {
    if (trendValue) return trendValue;
    if (previousValue !== undefined && currentValue !== undefined && previousValue !== 0) {
      const change = ((currentValue - previousValue) / previousValue) * 100;
      return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
    }
    return null;
  };

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }

  const content = (
    <Card className={cn("border transition-all", onClick && "cursor-pointer hover:shadow-md", colorClasses[color], className)} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className={cn("font-bold", sizeClasses[size].value)}>{formatValue(value)}</p>
            {(trend || calculateTrend()) && (
              <div className={cn("flex items-center gap-1 mt-1 text-xs", trendColor)}>
                <TrendIcon className="h-3 w-3" />
                <span>{calculateTrend()}</span>
                {trendLabel && <span className="text-muted-foreground">vs {trendLabel}</span>}
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn("rounded-lg", iconBgClasses[color], sizeClasses[size].icon)}>
              <Icon className="h-full w-full" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip><TooltipTrigger asChild>{content}</TooltipTrigger><TooltipContent><p>{tooltip}</p></TooltipContent></Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}

export default DashboardKPI;
