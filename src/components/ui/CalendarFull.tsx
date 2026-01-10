// V14-055: CalendarFull.tsx
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type?: "ferias" | "feriado" | "evento" | "reuniao";
  color?: string;
}

interface CalendarFullProps {
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const eventColors = {
  ferias: "bg-blue-500",
  feriado: "bg-red-500",
  evento: "bg-green-500",
  reuniao: "bg-purple-500",
};

export function CalendarFull({ events = [], onDateClick, onEventClick, className }: CalendarFullProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date());

  const getEventsForDate = (day: number) => {
    return events.filter((e) => {
      const eventDate = new Date(e.date);
      return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
  };

  const isToday = (day: number) => {
    const now = new Date();
    return day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
  };

  const days: Array<{ day: number; isCurrentMonth: boolean }> = [];

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  return (
    <div className={cn("bg-background border rounded-lg p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{MONTHS[month]} {year}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={today}>Hoje</Button>
          <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((item, index) => {
          const dayEvents = item.isCurrentMonth ? getEventsForDate(item.day) : [];
          return (
            <div
              key={index}
              className={cn(
                "min-h-[80px] p-1 border rounded cursor-pointer hover:bg-accent/50 transition-colors",
                !item.isCurrentMonth && "text-muted-foreground bg-muted/30",
                isToday(item.day) && item.isCurrentMonth && "border-primary"
              )}
              onClick={() => item.isCurrentMonth && onDateClick?.(new Date(year, month, item.day))}
            >
              <span className={cn("text-sm", isToday(item.day) && item.isCurrentMonth && "font-bold text-primary")}>{item.day}</span>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn("text-xs px-1 py-0.5 rounded truncate text-white", event.color || eventColors[event.type || "evento"])}
                    onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} mais</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

