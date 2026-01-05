import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
interface TimelineItem { date: string; title: string; description?: string; status?: "completed" | "current" | "pending"; icon?: React.ReactNode; }
interface TimelineChartProps { items: TimelineItem[]; className?: string; }
export function TimelineChart({ items, className }: TimelineChartProps) {
  return (
    <div className={cn("space-y-4", className)}>{items.map((item, i) => (<div key={i} className="flex gap-4"><div className="flex flex-col items-center"><div className={cn("w-3 h-3 rounded-full", item.status === "completed" ? "bg-green-500" : item.status === "current" ? "bg-blue-500" : "bg-muted")} />{i < items.length - 1 && <div className="w-0.5 flex-1 bg-muted" />}</div><div className="pb-4"><p className="text-xs text-muted-foreground">{item.date}</p><p className="font-medium">{item.title}</p>{item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}</div></div>))}</div>
  );
}
export default TimelineChart;
