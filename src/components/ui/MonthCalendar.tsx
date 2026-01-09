import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, isSameMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthCalendarProps { selectedDate: Date; onDateSelect: (date: Date) => void; markedDates?: Date[]; className?: string; }

export function MonthCalendar({ selectedDate, onDateSelect, markedDates = [], className }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) { days.push(day); day = addDays(day, 1); }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="font-medium">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</span>
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-4 w-4" /></Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => <div key={d} className="p-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const isMarked = markedDates.some((m) => isSameDay(m, d));
          return (
            <Button key={d.toISOString()} variant={isSameDay(d, selectedDate) ? "default" : "ghost"} className={cn("h-10 w-full relative", !isSameMonth(d, currentMonth) && "text-muted-foreground opacity-50")} onClick={() => onDateSelect(d)}>
              {format(d, "d")}
              {isMarked && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
export default MonthCalendar;
