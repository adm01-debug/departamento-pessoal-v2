import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BarItem { label: string; value: number; color?: string; }
interface HorizontalBarChartProps { title: string; items: BarItem[]; showValues?: boolean; className?: string; }

export function HorizontalBarChart({ title, items, showValues = true, className }: HorizontalBarChartProps) {
  const maxValue = Math.max(...items.map((i) => i.value));

  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-sm"><span>{item.label}</span>{showValues && <span className="font-medium">{item.value}</span>}</div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color || "hsl(var(--primary))" }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default HorizontalBarChart;
