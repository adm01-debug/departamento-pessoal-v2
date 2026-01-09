import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DayEntry { date: string; dayName: string; entry?: string; exit?: string; total?: string; status?: "normal" | "falta" | "feriado" | "folga"; }
interface TimesheetGridProps { entries: DayEntry[]; className?: string; }

const statusColors = { normal: "", falta: "bg-red-50", feriado: "bg-blue-50", folga: "bg-gray-50" };
const statusLabels = { normal: "", falta: "Falta", feriado: "Feriado", folga: "Folga" };

export function TimesheetGrid({ entries, className }: TimesheetGridProps) {
  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="grid grid-cols-5 bg-muted text-sm font-medium">
        <div className="p-2">Data</div><div className="p-2">Entrada</div><div className="p-2">Saída</div><div className="p-2">Total</div><div className="p-2">Status</div>
      </div>
      {entries.map((entry, i) => (
        <div key={i} className={cn("grid grid-cols-5 text-sm border-t", statusColors[entry.status || "normal"])}>
          <div className="p-2"><span className="font-medium">{entry.date}</span><span className="text-muted-foreground ml-1">({entry.dayName})</span></div>
          <div className="p-2">{entry.entry || "-"}</div>
          <div className="p-2">{entry.exit || "-"}</div>
          <div className="p-2 font-medium">{entry.total || "-"}</div>
          <div className="p-2">{entry.status && entry.status !== "normal" && <Badge variant="secondary">{statusLabels[entry.status]}</Badge>}</div>
        </div>
      ))}
    </div>
  );
}
export default TimesheetGrid;
