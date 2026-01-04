import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Info, LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface DashboardMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  progress?: number;
  target?: number;
  description?: string;
  status?: "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "inline" | "compact";
  className?: string;
}

const statusColors = {
  success: "text-green-600",
  warning: "text-yellow-600",
  danger: "text-red-600",
  info: "text-blue-600",
};

const progressColors = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

export function DashboardMetric({
  label, value, unit, icon: Icon, trend, trendValue, progress, target,
  description, status = "info", size = "md", variant = "default", className
}: DashboardMetricProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500";

  const sizeClasses = {
    sm: { value: "text-lg", label: "text-xs", icon: "h-4 w-4" },
    md: { value: "text-2xl", label: "text-sm", icon: "h-5 w-5" },
    lg: { value: "text-3xl", label: "text-base", icon: "h-6 w-6" },
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center justify-between p-2 rounded-lg bg-muted/50", className)}>
        <span className={cn("font-medium", sizeClasses[size].label)}>{label}</span>
        <div className="flex items-center gap-1">
          <span className={cn("font-bold", statusColors[status])}>{value}{unit && <span className="text-xs ml-0.5">{unit}</span>}</span>
          {trend && <TrendIcon className={cn("h-3 w-3", trendColor)} />}
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {Icon && <Icon className={cn(sizeClasses[size].icon, statusColors[status])} />}
        <div>
          <span className={cn("text-muted-foreground", sizeClasses[size].label)}>{label}: </span>
          <span className={cn("font-bold", sizeClasses[size].value, statusColors[status])}>{value}{unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={cn(sizeClasses[size].icon, statusColors[status])} />}
          <span className={cn("font-medium text-muted-foreground", sizeClasses[size].label)}>{label}</span>
          {description && (
            <TooltipProvider>
              <Tooltip><TooltipTrigger><Info className="h-3 w-3 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>{description}</p></TooltipContent></Tooltip>
            </TooltipProvider>
          )}
        </div>
        {trend && trendValue && (
          <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
            <TrendIcon className="h-3 w-3" />{trendValue}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("font-bold", sizeClasses[size].value, statusColors[status])}>{value}</span>
        {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
        {target && <span className="text-muted-foreground text-xs">/ {target}</span>}
      </div>
      {progress !== undefined && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <span className="text-xs text-muted-foreground">{progress}% do objetivo</span>
        </div>
      )}
    </div>
  );
}

export default DashboardMetric;
