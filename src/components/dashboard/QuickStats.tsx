import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Clock } from "lucide-react";
interface QuickStatsProps { stats: { colaboradores: number; custoFolha: number; feriasVencidas: number; horasExtras: number; admissoesMes: number; demissoesMes: number; }; }
export function QuickStats({ stats }: QuickStatsProps) {
  const items = [{ icon: Users, label: "Colaboradores", value: stats.colaboradores, color: "text-blue-500" }, { icon: DollarSign, label: "Custo Folha", value: `R$ ${(stats.custoFolha / 1000).toFixed(0)}k`, color: "text-green-500" }, { icon: Calendar, label: "Férias Vencidas", value: stats.feriasVencidas, color: stats.feriasVencidas > 0 ? "text-red-500" : "text-green-500" }, { icon: Clock, label: "Horas Extras", value: `${stats.horasExtras}h`, color: "text-orange-500" }, { icon: TrendingUp, label: "Admissões", value: stats.admissoesMes, color: "text-green-500" }, { icon: TrendingDown, label: "Demissões", value: stats.demissoesMes, color: "text-red-500" }];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">{items.map((item, i) => <Card key={i}><CardContent className="pt-4"><div className="flex items-center gap-2"><item.icon className={`h-5 w-5 ${item.color}`} /><div><p className="text-2xl font-bold">{item.value}</p><p className="text-xs text-muted-foreground">{item.label}</p></div></div></CardContent></Card>)}</div>
  );
}
export default QuickStats;
