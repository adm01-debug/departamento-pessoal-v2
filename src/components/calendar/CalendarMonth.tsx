import { memo } from "react";
interface CalendarMonthProps { children: React.ReactNode; }
export const CalendarMonth = memo(function CalendarMonth({ children }: CalendarMonthProps) {
  return <div className="grid grid-cols-7 gap-1">{children}</div>;
});
