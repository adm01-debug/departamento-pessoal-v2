import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, Coffee } from "lucide-react";

interface AttendanceSummaryProps { totalDays: number; presentDays: number; absentDays: number; lateDays: number; workedHours: string; expectedHours: string; className?: string; }

export function AttendanceSummary({ totalDays, presentDays, absentDays, lateDays, workedHours, expectedHours, className }: AttendanceSummaryProps) {
  const attendanceRate = ((presentDays / totalDays) * 100).toFixed(1);

  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base">Resumo de Frequência</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600">{presentDays}</p>
            <p className="text-xs text-muted-foreground">Presenças</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <XCircle className="h-6 w-6 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-600">{absentDays}</p>
            <p className="text-xs text-muted-foreground">Faltas</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-yellow-600">{lateDays}</p>
            <p className="text-xs text-muted-foreground">Atrasos</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Coffee className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-600">{attendanceRate}%</p>
            <p className="text-xs text-muted-foreground">Frequência</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t flex justify-between text-sm">
          <span className="text-muted-foreground">Horas Trabalhadas: <strong>{workedHours}</strong></span>
          <span className="text-muted-foreground">Esperado: <strong>{expectedHours}</strong></span>
        </div>
      </CardContent>
    </Card>
  );
}
export default AttendanceSummary;
