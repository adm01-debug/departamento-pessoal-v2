import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarEvent { id: string; title: string; start: Date; color?: string; }
interface MonthViewProps { events?: CalendarEvent[]; selectedDate?: Date; onDateSelect?: (date: Date) => void; onEventClick?: (event: CalendarEvent) => void; onAddEvent?: (date: Date) => void; className?: string; }

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function MonthView({ events = [], selectedDate, onDateSelect, onEventClick, onAddEvent, className }: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const getEventsForDay = (day: Date) => events.filter(e => isSameDay(e.start, day));

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>Hoje</Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(m => subMonths(m, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <CardTitle className="text-lg min-w-[160px] text-center">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(m => addMonths(m, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          {onAddEvent && <Button size="sm" onClick={() => onAddEvent(currentMonth)}><Plus className="h-4 w-4 mr-1" />Novo</Button>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
          {WEEKDAYS.map(day => <div key={day} className="bg-background p-2 text-center text-sm font-medium text-muted-foreground">{day}</div>)}
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            return (
              <div key={i} className={cn("bg-background min-h-[80px] p-1 cursor-pointer hover:bg-muted/30 transition-colors", !isCurrentMonth && "bg-muted/20")} onClick={() => onDateSelect?.(day)}>
                <div className={cn("flex items-center justify-center w-7 h-7 rounded-full text-sm mb-1", isToday(day) && "bg-primary text-primary-foreground font-bold", isSelected && !isToday(day) && "bg-primary/20", !isCurrentMonth && "text-muted-foreground/50")}>{format(day, "d")}</div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map(event => (
                    <div key={event.id} className="text-xs px-1 py-0.5 rounded truncate cursor-pointer" style={{ backgroundColor: event.color || "#3b82f6", color: "white" }} onClick={e => { e.stopPropagation(); onEventClick?.(event); }}>{event.title}</div>
                  ))}
                  {dayEvents.length > 2 && <Badge variant="secondary" className="text-xs w-full justify-center">+{dayEvents.length - 2}</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
export default MonthView;
