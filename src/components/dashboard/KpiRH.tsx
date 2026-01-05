import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface KpiRHProps { kpis: { nome: string; valor: number; meta: number; unidade: string }[]; }
export function KpiRH({ kpis }: KpiRHProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Indicadores KPI de RH</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => {
          const atingido = kpi.valor >= kpi.meta;
          return <Card key={i} className={atingido ? "border-green-500" : "border-red-500"}><CardHeader className="pb-2"><CardTitle className="text-sm">{kpi.nome}</CardTitle></CardHeader><CardContent><p className={`text-3xl font-bold ${atingido ? "text-green-600" : "text-red-600"}`}>{kpi.valor}{kpi.unidade}</p><p className="text-sm text-muted-foreground">Meta: {kpi.meta}{kpi.unidade}</p></CardContent></Card>;
        })}
      </div>
    </div>
  );
}
export default KpiRH;
