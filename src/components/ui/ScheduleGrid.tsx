import React from "react";
import { cn } from "@/lib/utils";

interface ScheduleItem { day: number; startTime: string; endTime: string; label?: string; color?: string; }
interface ScheduleGridProps { items: ScheduleItem[]; startHour?: number; endHour?: number; className?: string; }

const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function ScheduleGrid({ items, startHour = 6, endHour = 22, className }: ScheduleGridProps) {
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="grid grid-cols-8 bg-muted text-xs font-medium">
        <div className="p-2" />
        {days.map((d) => <div key={d} className="p-2 text-center">{d}</div>)}
      </div>
      {hours.map((hour) => (
        <div key={hour} className="grid grid-cols-8 border-t text-xs">
          <div className="p-2 text-muted-foreground">{hour}:00</div>
          {days.map((_, dayIdx) => {
            const item = items.find((i) => i.day === dayIdx && parseInt(i.startTime) <= hour && parseInt(i.endTime) > hour);
            return (
              <div key={dayIdx} className={cn("p-1 border-l min-h-[30px]", item && "text-white text-center")} style={item ? { backgroundColor: item.color || "#3b82f6" } : undefined}>
                {item && parseInt(item.startTime) === hour && item.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
export default ScheduleGrid;
