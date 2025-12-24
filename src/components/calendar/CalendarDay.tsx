import { memo } from "react";
import { cn } from "@/lib/utils";
interface CalendarDayProps { day: number; isToday?: boolean; isSelected?: boolean; onClick?: () => void; hasEvents?: boolean; }
export const CalendarDay = memo(function CalendarDay({ day, isToday, isSelected, onClick, hasEvents }: CalendarDayProps) {
  return (
    <button onClick={onClick} className={cn("w-10 h-10 rounded-full flex flex-col items-center justify-center text-sm relative", isToday && "bg-primary/10", isSelected && "bg-primary text-primary-foreground")}>
      {day}{hasEvents && <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />}
    </button>
  );
});
