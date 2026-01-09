import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ComparisonItem { label: string; current: number; previous: number; }
interface ComparisonCardProps { title: string; items: ComparisonItem[]; className?: string; }

export function ComparisonCard({ title, items, className }: ComparisonCardProps) {
  const maxValue = Math.max(...items.flatMap((i) => [i.current, i.previous]));

  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, i) => {
          const change = ((item.current - item.previous) / item.previous * 100).toFixed(1);
          const isPositive = item.current >= item.previous;
          return (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span>{item.label}</span><span className={cn("font-medium", isPositive ? "text-green-600" : "text-red-600")}>{isPositive ? "+" : ""}{change}%</span></div>
              <div className="space-y-1">
                <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground w-12">Atual</span><Progress value={(item.current / maxValue) * 100} className="h-2 flex-1" /><span className="text-xs font-medium w-10 text-right">{item.current}</span></div>
                <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground w-12">Anterior</span><Progress value={(item.previous / maxValue) * 100} className="h-2 flex-1 opacity-50" /><span className="text-xs w-10 text-right text-muted-foreground">{item.previous}</span></div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
export default ComparisonCard;
