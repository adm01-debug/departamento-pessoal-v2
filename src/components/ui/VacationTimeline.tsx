import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sun, Calendar } from "lucide-react";

interface VacationPeriod { id: string; startDate: string; endDate: string; days: number; type: "gozo" | "abono" | "vendida"; status: "agendada" | "em_gozo" | "concluida"; }
interface VacationTimelineProps { periods: VacationPeriod[]; className?: string; }

const typeLabels = { gozo: "Gozo", abono: "Abono", vendida: "Vendida" };
const statusColors = { agendada: "bg-blue-500", em_gozo: "bg-yellow-500", concluida: "bg-green-500" };

export function VacationTimeline({ periods, className }: VacationTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {periods.map((period) => (
        <div key={period.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Sun className="h-5 w-5 text-primary" /></div>
            <div className="w-0.5 flex-1 bg-border mt-2" />
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={statusColors[period.status]}>{period.status.replace("_", " ")}</Badge>
              <Badge variant="outline">{typeLabels[period.type]}</Badge>
            </div>
            <p className="font-medium">{period.days} dias</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{period.startDate} - {period.endDate}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default VacationTimeline;
