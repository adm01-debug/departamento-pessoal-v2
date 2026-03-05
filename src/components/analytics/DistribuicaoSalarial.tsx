import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart } from "@/components/charts/DonutChart";
interface FaixaSalarial { faixa: string; quantidade: number; percentual: number; }
interface DistribuicaoSalarialProps { data: FaixaSalarial[]; }
const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
export function DistribuicaoSalarial({ data }: DistribuicaoSalarialProps) {
  const chartData = data.map((d, i) => ({ name: d.faixa, value: d.quantidade, color: colors[i % colors.length] }));
  const total = data.reduce((acc, d) => acc + d.quantidade, 0);
  return (
    <Card><CardHeader><CardTitle className="text-base">Distribuição Salarial</CardTitle></CardHeader><CardContent><DonutChart data={chartData} centerValue={String(total)} centerLabel="Total" /></CardContent></Card>
  );
}
export default DistribuicaoSalarial;
