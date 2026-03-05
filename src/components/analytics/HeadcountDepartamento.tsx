import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/charts/BarChart";
interface DepartamentoData { departamento: string; colaboradores: number; custo: number; percentual: number; }
interface HeadcountDepartamentoProps { data: DepartamentoData[]; }
export function HeadcountDepartamento({ data }: HeadcountDepartamentoProps) {
  const chartData = data.map(d => ({ departamento: d.departamento, colaboradores: d.colaboradores }));
  return (
    <Card><CardHeader><CardTitle className="text-base">Headcount por Departamento</CardTitle></CardHeader><CardContent><BarChart title="" data={chartData} xKey="departamento" bars={[{ dataKey: 'colaboradores', color: '#3b82f6', name: 'Colaboradores' }]} /></CardContent></Card>
  );
}
export default HeadcountDepartamento;
