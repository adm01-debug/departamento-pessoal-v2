import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Sun } from "lucide-react";

interface VacationCardProps { employeeName?: string; acquisitivePeriod: string; dueDate: string; daysAvailable: number; daysTaken?: number; status?: "disponivel" | "agendada" | "em_gozo" | "vencida"; className?: string; }

export function VacationCard({ employeeName, acquisitivePeriod, dueDate, daysAvailable, daysTaken = 0, status = "disponivel", className }: VacationCardProps) {
  const totalDays = 30;
  const usedPercent = (daysTaken / totalDays) * 100;
  const statusConfig = { disponivel: { color: "bg-green-500", label: "Disponível" }, agendada: { color: "bg-blue-500", label: "Agendada" }, em_gozo: { color: "bg-yellow-500", label: "Em Gozo" }, vencida: { color: "bg-red-500", label: "Vencida" } };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2"><Sun className="h-5 w-5 text-yellow-500" /><CardTitle className="text-base">{employeeName || "Férias"}</CardTitle></div>
        <Badge className={statusConfig[status].color}>{statusConfig[status].label}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><p className="text-muted-foreground">Período Aquisitivo</p><p className="font-medium">{acquisitivePeriod}</p></div>
          <div><p className="text-muted-foreground">Limite</p><p className="font-medium">{dueDate}</p></div>
        </div>
        <div><p className="text-sm text-muted-foreground mb-1">Dias Disponíveis: {daysAvailable} / {totalDays}</p><Progress value={100 - usedPercent} className="h-2" /></div>
        {daysTaken > 0 && <p className="text-xs text-muted-foreground"><Calendar className="h-3 w-3 inline mr-1" />{daysTaken} dias já utilizados</p>}
      </CardContent>
    </Card>
  );
}
export default VacationCard;
