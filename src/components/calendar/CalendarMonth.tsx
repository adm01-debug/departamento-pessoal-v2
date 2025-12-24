import { memo } from "react";
interface CalendarMonthProps { month: number; year: number; children?: React.ReactNode; }
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
export const CalendarMonth = memo(function CalendarMonth({ month, year, children }: CalendarMonthProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{months[month]} {year}</h3>
      {children}
    </div>
  );
});
