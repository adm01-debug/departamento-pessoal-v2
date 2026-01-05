import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, User, Clock } from "lucide-react";
interface PeriodoFeriasCardProps { periodo: { periodoAquisitivo: string; dataLimite: string; diasDisponiveis: number; diasUsados: number; vencido: boolean }; }
export function PeriodoFeriasCard({ periodo }: PeriodoFeriasCardProps) {
  const total = periodo.diasDisponiveis + periodo.diasUsados;
  const progress = (periodo.diasUsados / total) * 100;
  return (<Card className={periodo.vencido ? "border-red-200 bg-red-50" : ""}><CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-base">Período {periodo.periodoAquisitivo}</CardTitle>{periodo.vencido && <Badge variant="destructive">VENCIDO</Badge>}</div></CardHeader><CardContent><div className="space-y-3"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Limite:</span><span>{periodo.dataLimite}</span></div><div><div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Dias usados:</span><span>{periodo.diasUsados}/{total}</span></div><Progress value={progress} className="h-2" /></div><div className="flex justify-between text-sm font-medium"><span>Disponíveis:</span><span className={periodo.diasDisponiveis > 0 ? "text-green-600" : ""}>{periodo.diasDisponiveis} dias</span></div></div></CardContent></Card>);
}
export default PeriodoFeriasCard;
