import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface ComparativoMensalProps { competenciaAtual: string; competenciaAnterior: string; dados: { item: string; atual: number; anterior: number; variacao: number }[]; }
export function ComparativoMensal({ competenciaAtual, competenciaAnterior, dados }: ComparativoMensalProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Comparativo Mensal</h1>
      <Card>
        <CardHeader><CardTitle>{competenciaAtual} vs {competenciaAnterior}</CardTitle></CardHeader>
        <CardContent>
          <Table><TableHeader><TableRow><TableHead>Item</TableHead><TableHead className="text-right">{competenciaAnterior}</TableHead><TableHead className="text-right">{competenciaAtual}</TableHead><TableHead className="text-right">Variação</TableHead></TableRow></TableHeader>
          <TableBody>{dados.map((d, i) => <TableRow key={i}><TableCell>{d.item}</TableCell><TableCell className="text-right">R$ {d.anterior.toLocaleString()}</TableCell><TableCell className="text-right">R$ {d.atual.toLocaleString()}</TableCell><TableCell className={`text-right font-bold ${d.variacao >= 0 ? "text-red-600" : "text-green-600"}`}>{d.variacao >= 0 ? "+" : ""}{d.variacao.toFixed(2)}%</TableCell></TableRow>)}</TableBody></Table>
        </CardContent>
      </Card>
    </div>
  );
}
export default ComparativoMensal;
