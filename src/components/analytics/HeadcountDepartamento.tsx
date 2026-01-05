import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/charts/BarChart";
interface DepartamentoData { departamento: string; colaboradores: number; custo: number; percentual: number; }
interface HeadcountDepartamentoProps { data: DepartamentoData[]; }
export function HeadcountDepartamento({ data }: HeadcountDepartamentoProps) {
  const chartData = data.map(d => ({ label: d.departamento, value: d.colaboradores, color: `hsl(${Math.random() * 360}, 70%, 50%)` }));
  return (
    <Card><CardHeader><CardTitle className="text-base">Headcount por Departamento</CardTitle></CardHeader><CardContent><BarChart data={chartData} showValues /></CardContent></Card>
  );
}
export default HeadcountDepartamento;
