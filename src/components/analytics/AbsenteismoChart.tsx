import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
interface AbsenteismoData { departamento: string; diasPerdidos: number; taxaAbsenteismo: number; principalMotivo: string; }
interface AbsenteismoChartProps { data: AbsenteismoData[]; meta?: number; }
export function AbsenteismoChart({ data, meta = 3 }: AbsenteismoChartProps) {
  const mediaGeral = data.reduce((a, d) => a + d.taxaAbsenteismo, 0) / data.length;
  return (
    <Card><CardHeader><CardTitle className="text-base flex items-center justify-between">Absenteísmo por Departamento<span className={`text-sm ${mediaGeral > meta ? "text-red-500" : "text-green-500"}`}>{mediaGeral > meta ? <AlertTriangle className="h-4 w-4 inline mr-1" /> : <CheckCircle className="h-4 w-4 inline mr-1" />}Média: {mediaGeral.toFixed(1)}%</span></CardTitle></CardHeader><CardContent className="space-y-4">{data.map((d, i) => <div key={i} className="space-y-1"><div className="flex justify-between text-sm"><span>{d.departamento}</span><span className={d.taxaAbsenteismo > meta ? "text-red-600" : "text-green-600"}>{d.taxaAbsenteismo.toFixed(1)}%</span></div><Progress value={d.taxaAbsenteismo * 10} className={`h-2 ${d.taxaAbsenteismo > meta ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`} /><p className="text-xs text-muted-foreground">{d.diasPerdidos} dias - {d.principalMotivo}</p></div>)}<div className="pt-2 border-t"><p className="text-xs text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" />Meta: {meta}%</p></div></CardContent></Card>
  );
}
export default AbsenteismoChart;
