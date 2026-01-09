import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AbsenceDay { date: number; type?: "falta" | "ferias" | "licenca" | "feriado" | "folga"; }
interface AbsenceCalendarProps { month: number; year: number; absences: AbsenceDay[]; className?: string; }

const typeColors = { falta: "bg-red-500", ferias: "bg-blue-500", licenca: "bg-yellow-500", feriado: "bg-green-500", folga: "bg-gray-400" };
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export function AbsenceCalendar({ month, year, absences, className }: AbsenceCalendarProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, () => null);

  return (
    <div className={cn("", className)}>
      <h3 className="font-medium text-center mb-4">{months[month]} {year}</h3>
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <div key={i} className="text-muted-foreground font-medium">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
        {days.map((day) => {
          const absence = absences.find((a) => a.date === day);
          return (
            <div key={day} className={cn("h-8 w-8 flex items-center justify-center text-sm rounded", absence ? `${typeColors[absence.type!]} text-white` : "hover:bg-muted")}>{day}</div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {Object.entries(typeColors).map(([type, color]) => <Badge key={type} className={color}>{type}</Badge>)}
      </div>
    </div>
  );
}
export default AbsenceCalendar;
