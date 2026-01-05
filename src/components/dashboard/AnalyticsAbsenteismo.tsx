import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
interface AnalyticsAbsenteismoProps { taxaGeral: number; porMotivo: { motivo: string; dias: number; percentual: number }[]; porDepartamento: { nome: string; taxa: number }[]; custoEstimado: number; }
export function AnalyticsAbsenteismo({ taxaGeral, porMotivo, porDepartamento, custoEstimado }: AnalyticsAbsenteismoProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics - Absenteísmo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Taxa Geral</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{taxaGeral.toFixed(2)}%</p><Progress value={taxaGeral * 10} className="mt-2" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Custo Estimado</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-red-600">R$ {custoEstimado.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Por Motivo</CardTitle></CardHeader><CardContent>{porMotivo.map((m, i) => <div key={i} className="flex justify-between py-1"><span>{m.motivo}</span><span>{m.percentual.toFixed(1)}%</span></div>)}</CardContent></Card>
      </div>
    </div>
  );
}
export default AnalyticsAbsenteismo;
