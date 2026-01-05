import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface ProjecaoOrcamentoProps { orcamentoAnual: number; gastoAtual: number; projecaoFinal: number; porMes: { mes: string; orcado: number; realizado: number }[]; }
export function ProjecaoOrcamento({ orcamentoAnual, gastoAtual, projecaoFinal, porMes }: ProjecaoOrcamentoProps) {
  const percentualUtilizado = (gastoAtual / orcamentoAnual) * 100;
  const desvio = ((projecaoFinal - orcamentoAnual) / orcamentoAnual) * 100;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projeções Orçamentárias</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Orçamento Anual</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">R$ {(orcamentoAnual/1000000).toFixed(2)}M</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Gasto Atual</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">R$ {(gastoAtual/1000000).toFixed(2)}M</p><p className="text-sm">{percentualUtilizado.toFixed(1)}% utilizado</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Projeção Final</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">R$ {(projecaoFinal/1000000).toFixed(2)}M</p></CardContent></Card>
        <Card className={desvio > 0 ? "border-red-500" : "border-green-500"}><CardHeader><CardTitle className="text-sm">Desvio</CardTitle></CardHeader><CardContent><p className={`text-2xl font-bold ${desvio > 0 ? "text-red-600" : "text-green-600"}`}>{desvio > 0 ? "+" : ""}{desvio.toFixed(1)}%</p></CardContent></Card>
      </div>
    </div>
  );
}
export default ProjecaoOrcamento;
