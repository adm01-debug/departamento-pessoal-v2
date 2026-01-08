import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, addHours, isSameHour, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

interface SchedulerProps {
  events?: SchedulerEvent[];
  className?: string;
  startHour?: number;
  endHour?: number;
  onEventClick?: (event: SchedulerEvent) => void;
  onSlotClick?: (date: Date, hour: number) => void;
}

export function Scheduler({ events = [], className, startHour = 8, endHour = 18, onEventClick, onSlotClick }: SchedulerProps) {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { locale: ptBR }));
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const prevWeek = () => setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => setWeekStart(addDays(weekStart, 7));

  const getEventsForSlot = (day: Date, hour: number) => {
    const slotStart = addHours(new Date(day.setHours(0, 0, 0, 0)), hour);
    return events.filter(event => isSameDay(event.start, day) && event.start.getHours() === hour);
  };

  return (
    <div className={cn("bg-card rounded-lg border overflow-hidden", className)}>
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={nextWeek}><ChevronRight className="h-4 w-4" /></Button>
          <span className="text-sm font-medium">{format(weekStart, "MMMM yyyy", { locale: ptBR })}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setWeekStart(startOfWeek(new Date(), { locale: ptBR }))}>Hoje</Button>
      </div>
      <div className="flex">
        <div className="w-16 flex-shrink-0 border-r">
          <div className="h-12 border-b" />
          {hours.map(hour => (
            <div key={hour} className="h-12 border-b px-2 text-xs text-muted-foreground flex items-start pt-1">{`${hour}:00`}</div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7">
          {days.map(day => (
            <div key={day.toISOString()} className="border-r last:border-r-0">
              <div className="h-12 border-b p-1 text-center bg-muted/50">
                <div className="text-xs font-medium">{format(day, "EEE", { locale: ptBR })}</div>
                <div className={cn("text-sm", isSameDay(day, new Date()) && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto")}>{format(day, "d")}</div>
              </div>
              {hours.map(hour => {
                const slotEvents = getEventsForSlot(day, hour);
                return (
                  <div key={hour} className="h-12 border-b hover:bg-accent/50 cursor-pointer relative" onClick={() => onSlotClick?.(day, hour)}>
                    {slotEvents.map(event => (
                      <div key={event.id} className="absolute inset-x-0.5 top-0.5 rounded text-xs p-1 truncate text-white cursor-pointer" style={{ backgroundColor: event.color || "#3b82f6" }} onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}>{event.title}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Scheduler;
