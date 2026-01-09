import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WeekCalendarProps { selectedDate: Date; onDateSelect: (date: Date) => void; className?: string; }

export function WeekCalendar({ selectedDate, onDateSelect, className }: WeekCalendarProps) {
  const [weekStart, setWeekStart] = React.useState(startOfWeek(selectedDate, { weekStartsOn: 0 }));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="font-medium">{format(weekStart, "MMMM yyyy", { locale: ptBR })}</span>
        <Button variant="ghost" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}><ChevronRight className="h-4 w-4" /></Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <Button key={day.toISOString()} variant={isSameDay(day, selectedDate) ? "default" : "ghost"} className="flex-col h-auto py-2" onClick={() => onDateSelect(day)}>
            <span className="text-xs text-muted-foreground">{format(day, "EEE", { locale: ptBR })}</span>
            <span className="text-lg">{format(day, "d")}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
export default WeekCalendar;
