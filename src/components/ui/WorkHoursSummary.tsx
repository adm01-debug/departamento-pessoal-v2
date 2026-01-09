import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";

interface WorkHoursSummaryProps { totalHours: number; expectedHours: number; overtime: number; absences: number; className?: string; }

export function WorkHoursSummary({ totalHours, expectedHours, overtime, absences, className }: WorkHoursSummaryProps) {
  const balance = totalHours - expectedHours;
  const isPositive = balance >= 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />Resumo de Horas</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm text-muted-foreground">Trabalhadas</p><p className="text-2xl font-bold">{totalHours}h</p></div>
          <div><p className="text-sm text-muted-foreground">Previstas</p><p className="text-2xl font-bold">{expectedHours}h</p></div>
          <div><p className="text-sm text-muted-foreground">Extras</p><p className="text-2xl font-bold text-green-600">+{overtime}h</p></div>
          <div><p className="text-sm text-muted-foreground">Faltas</p><p className="text-2xl font-bold text-red-600">{absences}h</p></div>
        </div>
        <div className={cn("mt-4 p-3 rounded-lg flex items-center justify-between", isPositive ? "bg-green-50" : "bg-red-50")}>
          <span className="text-sm font-medium">Saldo</span>
          <span className={cn("flex items-center gap-1 font-bold", isPositive ? "text-green-600" : "text-red-600")}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {isPositive ? "+" : ""}{balance}h
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
export default WorkHoursSummary;
