import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface AnalyticsTurnoverProps { turnoverGeral: number; turnoverVoluntario: number; turnoverInvoluntario: number; porDepartamento: { nome: string; taxa: number }[]; porMes: { mes: string; admissoes: number; demissoes: number }[]; tempoMedioEmpresa: number; }
export function AnalyticsTurnover({ turnoverGeral, turnoverVoluntario, turnoverInvoluntario, porDepartamento, tempoMedioEmpresa }: AnalyticsTurnoverProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics - Turnover</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Turnover Geral</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{turnoverGeral.toFixed(1)}%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Voluntário</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-yellow-600">{turnoverVoluntario.toFixed(1)}%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Involuntário</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-red-600">{turnoverInvoluntario.toFixed(1)}%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Tempo Médio</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{tempoMedioEmpresa.toFixed(1)} anos</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-sm">Por Departamento</CardTitle></CardHeader><CardContent>{porDepartamento.map((d, i) => <div key={i} className="flex justify-between py-1 border-b"><span>{d.nome}</span><span className="font-bold">{d.taxa.toFixed(1)}%</span></div>)}</CardContent></Card>
    </div>
  );
}
export default AnalyticsTurnover;
