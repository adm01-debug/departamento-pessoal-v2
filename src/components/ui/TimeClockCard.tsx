import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, LogIn, LogOut, Coffee } from "lucide-react";

interface TimeEntry { type: "entrada" | "saida" | "intervalo_inicio" | "intervalo_fim"; time: string; }
interface TimeClockCardProps { date: string; entries: TimeEntry[]; totalHours?: string; status?: "completo" | "incompleto" | "falta"; className?: string; }

const icons = { entrada: LogIn, saida: LogOut, intervalo_inicio: Coffee, intervalo_fim: Coffee };
const labels = { entrada: "Entrada", saida: "Saída", intervalo_inicio: "Intervalo", intervalo_fim: "Retorno" };

export function TimeClockCard({ date, entries, totalHours, status = "incompleto", className }: TimeClockCardProps) {
  const statusConfig = { completo: "bg-green-500", incompleto: "bg-yellow-500", falta: "bg-red-500" };
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{date}</CardTitle>
        <Badge className={statusConfig[status]}>{status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((e, i) => { const Icon = icons[e.type]; return (
            <div key={i} className="flex items-center gap-2 text-sm"><Icon className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">{labels[e.type]}:</span><span className="font-medium">{e.time}</span></div>
          ); })}
        </div>
        {totalHours && <div className="mt-3 pt-3 border-t flex items-center gap-2"><Clock className="h-4 w-4" /><span className="text-sm">Total: <strong>{totalHours}</strong></span></div>}
      </CardContent>
    </Card>
  );
}
export default TimeClockCard;
