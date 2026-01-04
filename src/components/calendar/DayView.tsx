import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react";
import { format, isSameDay, addDays, subDays, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarEvent { id: string; title: string; start: Date; end?: Date; color?: string; location?: string; }
interface DayViewProps { events?: CalendarEvent[]; selectedDate?: Date; onDateSelect?: (date: Date) => void; onEventClick?: (event: CalendarEvent) => void; onAddEvent?: (date: Date) => void; className?: string; }

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function DayView({ events = [], selectedDate = new Date(), onDateSelect, onEventClick, onAddEvent, className }: DayViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const dayEvents = events.filter(e => isSameDay(e.start, currentDate));
  const getEventsForHour = (hour: number) => dayEvents.filter(e => e.start.getHours() === hour);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoje</Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(d => subDays(d, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <CardTitle className={cn("text-lg min-w-[200px] text-center", isToday(currentDate) && "text-primary")}>{format(currentDate, "EEEE, dd MMMM yyyy", { locale: ptBR })}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(d => addDays(d, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          {onAddEvent && <Button size="sm" onClick={() => onAddEvent(currentDate)}><Plus className="h-4 w-4 mr-1" />Novo</Button>}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="relative">
            {HOURS.map(hour => {
              const hourEvents = getEventsForHour(hour);
              return (
                <div key={hour} className="flex border-t min-h-[60px]">
                  <div className="w-16 py-2 text-xs text-muted-foreground text-right pr-3 flex-shrink-0">{String(hour).padStart(2, "0")}:00</div>
                  <div className="flex-1 relative py-1">
                    {hourEvents.map(event => (
                      <div key={event.id} className="mb-1 p-2 rounded cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: event.color || "#3b82f6" }} onClick={() => onEventClick?.(event)}>
                        <p className="text-sm font-medium text-white truncate">{event.title}</p>
                        <p className="text-xs text-white/80 flex items-center gap-1"><Clock className="h-3 w-3" />{format(event.start, "HH:mm")}{event.end && ` - ${format(event.end, "HH:mm")}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
export default DayView;
