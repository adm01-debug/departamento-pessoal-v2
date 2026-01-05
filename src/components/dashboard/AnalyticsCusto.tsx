import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface AnalyticsCustoProps { custoTotal: number; custoMedio: number; porRubrica: { rubrica: string; valor: number }[]; evolucao: { mes: string; custo: number }[]; }
export function AnalyticsCusto({ custoTotal, custoMedio, porRubrica }: AnalyticsCustoProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics - Custo por Colaborador</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Custo Total Folha</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">R$ {custoTotal.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Custo Médio/Colaborador</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">R$ {custoMedio.toFixed(2)}</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-sm">Por Rubrica</CardTitle></CardHeader><CardContent>{porRubrica.slice(0,5).map((r, i) => <div key={i} className="flex justify-between py-2 border-b"><span>{r.rubrica}</span><span className="font-bold">R$ {r.valor.toLocaleString()}</span></div>)}</CardContent></Card>
    </div>
  );
}
export default AnalyticsCusto;
