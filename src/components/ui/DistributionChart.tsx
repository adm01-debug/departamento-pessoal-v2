import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DistributionItem { label: string; value: number; color: string; }
interface DistributionChartProps { title: string; items: DistributionItem[]; className?: string; }

export function DistributionChart({ title, items, className }: DistributionChartProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="flex h-4 rounded-full overflow-hidden mb-4">
          {items.map((item, i) => <div key={i} className="h-full" style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.color }} />)}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm flex-1">{item.label}</span>
              <span className="text-sm font-medium">{((item.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default DistributionChart;
