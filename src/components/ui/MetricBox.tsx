import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricBoxProps { title: string; value: string | number; subtitle?: string; trend?: "up" | "down" | "neutral"; className?: string; }

export function MetricBox({ title, value, subtitle, trend, className }: MetricBoxProps) {
  const colors = { up: "text-green-600", down: "text-red-600", neutral: "text-muted-foreground" };
  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle></CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        {subtitle && <p className={cn("text-sm mt-1", trend ? colors[trend] : "text-muted-foreground")}>{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
export default MetricBox;
