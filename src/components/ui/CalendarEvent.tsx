import React from "react";
import { cn } from "@/lib/utils";

interface CalendarEventProps { title: string; startTime?: string; endTime?: string; color?: string; onClick?: () => void; className?: string; }

export function CalendarEvent({ title, startTime, endTime, color = "#3b82f6", onClick, className }: CalendarEventProps) {
  return (
    <div className={cn("rounded px-2 py-1 text-xs text-white cursor-pointer hover:opacity-90", className)} style={{ backgroundColor: color }} onClick={onClick}>
      <p className="font-medium truncate">{title}</p>
      {(startTime || endTime) && <p className="opacity-80">{startTime}{endTime && ` - ${endTime}`}</p>}
    </div>
  );
}
export default CalendarEvent;
