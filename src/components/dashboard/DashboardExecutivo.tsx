import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, TrendingDown, Calendar, AlertTriangle } from "lucide-react";
interface DashboardExecutivoProps { headcount: number; custoFolha: number; turnover: number; absenteismo: number; feriasVencidas: number; admissoesMes: number; demissoesMes: number; custoMedio: number; }
export function DashboardExecutivo({ headcount, custoFolha, turnover, absenteismo, feriasVencidas, admissoesMes, demissoesMes, custoMedio }: DashboardExecutivoProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Executivo</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" />Headcount</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{headcount}</p><p className="text-sm text-muted-foreground">colaboradores ativos</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4" />Custo Folha</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">R$ {(custoFolha/1000000).toFixed(2)}M</p><p className="text-sm text-muted-foreground">mensal</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-500" />Turnover</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{turnover.toFixed(1)}%</p><p className="text-sm text-muted-foreground">últimos 12 meses</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4" />Absenteísmo</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{absenteismo.toFixed(1)}%</p><p className="text-sm text-muted-foreground">no mês</p></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Movimentações do Mês</CardTitle></CardHeader><CardContent className="flex justify-around"><div className="text-center"><TrendingUp className="w-6 h-6 text-green-500 mx-auto" /><p className="text-2xl font-bold text-green-600">{admissoesMes}</p><p className="text-xs">Admissões</p></div><div className="text-center"><TrendingDown className="w-6 h-6 text-red-500 mx-auto" /><p className="text-2xl font-bold text-red-600">{demissoesMes}</p><p className="text-xs">Demissões</p></div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Custo Médio/Colaborador</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">R$ {custoMedio.toFixed(2)}</p></CardContent></Card>
        <Card className={feriasVencidas > 0 ? "border-yellow-500" : ""}><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2">{feriasVencidas > 0 && <AlertTriangle className="w-4 h-4 text-yellow-500" />}Férias Vencidas</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{feriasVencidas}</p><p className="text-sm text-muted-foreground">colaboradores</p></CardContent></Card>
      </div>
    </div>
  );
}
export default DashboardExecutivo;
