import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, addWeeks, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarEvent { id: string; title: string; start: Date; end?: Date; color?: string; }
interface WeekViewProps { events?: CalendarEvent[]; selectedDate?: Date; onDateSelect?: (date: Date) => void; onEventClick?: (event: CalendarEvent) => void; className?: string; }

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({ events = [], selectedDate = new Date(), onDateSelect, onEventClick, className }: WeekViewProps) {
  const [currentWeek, setCurrentWeek] = useState(selectedDate);
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const getEventsForDay = (day: Date) => events.filter(e => isSameDay(e.start, day));

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>Hoje</Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setCurrentWeek(w => subWeeks(w, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <CardTitle className="text-base">{format(weekStart, "dd MMM", { locale: ptBR })} - {format(weekEnd, "dd MMM yyyy", { locale: ptBR })}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setCurrentWeek(w => addWeeks(w, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <div className="w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-px bg-muted rounded-lg overflow-hidden">
          <div className="bg-background" />
          {days.map((day, i) => (
            <div key={i} className={cn("bg-background p-2 text-center cursor-pointer hover:bg-muted/50", isToday(day) && "bg-primary/5")} onClick={() => onDateSelect?.(day)}>
              <p className="text-xs text-muted-foreground">{format(day, "EEE", { locale: ptBR })}</p>
              <p className={cn("text-lg font-semibold", isToday(day) && "text-primary")}>{format(day, "d")}</p>
            </div>
          ))}
        </div>
        <ScrollArea className="h-[400px] mt-2">
          <div className="grid grid-cols-8 gap-px">
            {HOURS.map(hour => (
              <React.Fragment key={hour}>
                <div className="text-xs text-muted-foreground text-right pr-2 py-2">{String(hour).padStart(2, "0")}:00</div>
                {days.map((day, i) => {
                  const dayEvents = getEventsForDay(day).filter(e => e.start.getHours() === hour);
                  return (
                    <div key={i} className="border-t border-l min-h-[40px] relative">
                      {dayEvents.map(event => (
                        <div key={event.id} className="absolute inset-x-0 mx-0.5 px-1 py-0.5 rounded text-xs truncate cursor-pointer" style={{ backgroundColor: event.color || "#3b82f6", color: "white" }} onClick={() => onEventClick?.(event)}>{event.title}</div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
export default WeekView;
