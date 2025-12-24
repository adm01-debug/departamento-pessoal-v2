import { memo } from "react";
interface CalendarEventProps { titulo: string; hora?: string; cor?: string; }
export const CalendarEvent = memo(function CalendarEvent({ titulo, hora, cor = "bg-primary" }: CalendarEventProps) {
  return (
    <div className={`${cor} text-primary-foreground text-xs p-1 rounded truncate`}>
      {hora && <span className="font-medium">{hora} </span>}{titulo}
    </div>
  );
});
