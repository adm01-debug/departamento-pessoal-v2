import React from "react";
import { cn } from "@/lib/utils";

interface LegendItem { label: string; color: string; }
interface CalendarLegendProps { items: LegendItem[]; className?: string; }

export function CalendarLegend({ items, className }: CalendarLegendProps) {
  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-sm text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
export default CalendarLegend;
