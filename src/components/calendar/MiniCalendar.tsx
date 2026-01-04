import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MiniCalendarProps { selected?: Date; onSelect?: (date: Date) => void; highlightedDates?: Date[]; className?: string; }

export function MiniCalendar({ selected, onSelect, highlightedDates = [], className }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const isHighlighted = (date: Date) => highlightedDates.some(d => isSameDay(d, date));

  return (
    <Card className={cn("w-fit", className)}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(d => subMonths(d, 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm font-medium">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(d => addMonths(d, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map(day => <div key={day} className="text-xs text-muted-foreground font-medium py-1">{day}</div>)}
          {days.map(day => (
            <Button key={day.toISOString()} variant="ghost" size="sm" className={cn("h-8 w-8 p-0 font-normal", !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50", isToday(day) && "bg-primary/10", selected && isSameDay(day, selected) && "bg-primary text-primary-foreground", isHighlighted(day) && "ring-2 ring-primary ring-offset-1")} onClick={() => onSelect?.(day)}>
              {format(day, "d")}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default MiniCalendar;
