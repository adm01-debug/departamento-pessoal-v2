import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
interface TrendIndicatorProps { value: number; previousValue: number; format?: "percent" | "number" | "currency"; showIcon?: boolean; className?: string; invertColors?: boolean; }
export function TrendIndicator({ value, previousValue, format = "percent", showIcon = true, className, invertColors = false }: TrendIndicatorProps) {
  const diff = value - previousValue;
  const percentChange = previousValue !== 0 ? ((diff / previousValue) * 100) : 0;
  const isPositive = invertColors ? diff < 0 : diff > 0;
  const isNegative = invertColors ? diff > 0 : diff < 0;
  const formatValue = (val: number) => { switch (format) { case "percent": return `${Math.abs(val).toFixed(1)}%`; case "currency": return `R$ ${Math.abs(val).toLocaleString()}`; default: return Math.abs(val).toLocaleString(); } };
  const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
  return (
    <div className={cn("flex items-center gap-1 text-sm", isPositive && "text-green-600", isNegative && "text-red-600", diff === 0 && "text-muted-foreground", className)}>{showIcon && <Icon className="h-4 w-4" />}<span>{diff > 0 ? "+" : diff < 0 ? "-" : ""}{formatValue(format === "percent" ? percentChange : diff)}</span></div>
  );
}
export default TrendIndicator;
