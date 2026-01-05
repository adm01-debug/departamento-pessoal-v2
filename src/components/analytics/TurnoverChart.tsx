import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, ArrowRight } from "lucide-react";
interface TurnoverData { periodo: string; admissoes: number; demissoes: number; taxa: number; }
interface TurnoverChartProps { data: TurnoverData[]; }
export function TurnoverChart({ data }: TurnoverChartProps) {
  const ultimoMes = data[data.length - 1];
  const mesAnterior = data[data.length - 2];
  const variacao = ultimoMes && mesAnterior ? ultimoMes.taxa - mesAnterior.taxa : 0;
  return (
    <Card><CardHeader><CardTitle className="text-base flex items-center justify-between">Turnover<span className={`text-sm flex items-center ${variacao > 0 ? "text-red-500" : "text-green-500"}`}>{variacao > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}{Math.abs(variacao).toFixed(1)}%</span></CardTitle></CardHeader><CardContent><div className="space-y-4">{data.slice(-6).map((d, i) => <div key={i} className="flex items-center gap-4"><span className="w-16 text-sm text-muted-foreground">{d.periodo}</span><div className="flex-1 flex items-center gap-2"><span className="text-green-600 text-sm flex items-center"><TrendingUp className="h-3 w-3 mr-1" />{d.admissoes}</span><ArrowRight className="h-4 w-4 text-muted-foreground" /><span className="text-red-600 text-sm flex items-center"><TrendingDown className="h-3 w-3 mr-1" />{d.demissoes}</span></div><span className="font-medium">{d.taxa.toFixed(1)}%</span></div>)}</div></CardContent></Card>
  );
}
export default TurnoverChart;
