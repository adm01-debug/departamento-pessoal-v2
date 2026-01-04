import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarEvent { id: string; start: Date; color?: string; }
interface MiniCalendarProps { events?: CalendarEvent[]; selectedDate?: Date; onDateSelect?: (date: Date) => void; className?: string; }

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

export function MiniCalendar({ events = [], selectedDate, onDateSelect, className }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const getEventsForDay = (day: Date) => events.filter(e => isSameDay(e.start, day));

  return (
    <Card className={cn("w-[280px]", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(m => subMonths(m, 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <CardTitle className="text-sm">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(m => addMonths(m, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-7 gap-1 mb-2">{WEEKDAYS.map((day, i) => <div key={i} className="text-center text-xs font-medium text-muted-foreground">{day}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            return (
              <button key={i} onClick={() => onDateSelect?.(day)} className={cn("h-8 w-8 rounded-full text-sm flex flex-col items-center justify-center relative transition-colors", !isCurrentMonth && "text-muted-foreground/50", isToday(day) && "bg-primary/10 font-bold", isSelected && "bg-primary text-primary-foreground", !isSelected && isCurrentMonth && "hover:bg-muted")}>
                {format(day, "d")}
                {dayEvents.length > 0 && <div className="absolute bottom-0.5 flex gap-0.5">{dayEvents.slice(0, 3).map((e, j) => <div key={j} className="w-1 h-1 rounded-full" style={{ backgroundColor: e.color || "#3b82f6" }} />)}</div>}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
export default MiniCalendar;
