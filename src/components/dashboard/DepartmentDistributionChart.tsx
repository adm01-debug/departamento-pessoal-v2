import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DepartmentDistributionChartProps { className?: string; title?: string; value?: number | string; data?: any[]; loading?: boolean; }

export function DepartmentDistributionChart({ className, title = "DepartmentDistributionChart", value, data = [], loading = false }: DepartmentDistributionChartProps) {
  if (loading) return <Card className={cn("animate-pulse", className)}><CardHeader><div className="h-4 bg-muted rounded w-1/2" /></CardHeader><CardContent><div className="h-8 bg-muted rounded w-1/3" /></CardContent></Card>;
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle></CardHeader>
      <CardContent>
        {value !== undefined && <div className="text-2xl font-bold">{value}</div>}
        {data.length > 0 && <div className="text-sm text-muted-foreground">{data.length} itens</div>}
      </CardContent>
    </Card>
  );
}

export default DepartmentDistributionChart;
