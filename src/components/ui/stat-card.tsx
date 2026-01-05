import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
interface StatCardProps { title: string; value: string | number; icon?: LucideIcon; description?: string; trend?: { value: number; positive: boolean }; className?: string; }
export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>{Icon && <Icon className="h-4 w-4 text-muted-foreground" />}</CardHeader><CardContent><div className="text-2xl font-bold">{value}</div>{description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}{trend && <div className={cn("text-xs mt-1 flex items-center", trend.positive ? "text-green-600" : "text-red-600")}><span>{trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%</span><span className="text-muted-foreground ml-1">vs mês anterior</span></div>}</CardContent></Card>
  );
}
export default StatCard;
