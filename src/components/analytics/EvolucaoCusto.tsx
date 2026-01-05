import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatters } from "@/utils/formatters";
interface CustoData { mes: string; proventos: number; descontos: number; encargos: number; liquido: number; }
interface EvolucaoCustoProps { data: CustoData[]; }
export function EvolucaoCusto({ data }: EvolucaoCustoProps) {
  const total = data.reduce((acc, d) => acc + d.proventos, 0);
  const media = total / data.length;
  return (
    <Card><CardHeader><CardTitle className="text-base">Evolução do Custo de Pessoal</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-4 mb-4"><div className="text-center p-3 bg-green-50 rounded-lg"><p className="text-xs text-muted-foreground">Média Proventos</p><p className="text-lg font-bold text-green-700">{formatters.moeda(media)}</p></div><div className="text-center p-3 bg-red-50 rounded-lg"><p className="text-xs text-muted-foreground">Média Descontos</p><p className="text-lg font-bold text-red-700">{formatters.moeda(data.reduce((a, d) => a + d.descontos, 0) / data.length)}</p></div><div className="text-center p-3 bg-blue-50 rounded-lg"><p className="text-xs text-muted-foreground">Média Encargos</p><p className="text-lg font-bold text-blue-700">{formatters.moeda(data.reduce((a, d) => a + d.encargos, 0) / data.length)}</p></div></div><div className="space-y-2">{data.slice(-6).map((d, i) => <div key={i} className="flex items-center justify-between p-2 bg-muted rounded"><span className="text-sm">{d.mes}</span><span className="font-medium">{formatters.moeda(d.proventos)}</span></div>)}</div></CardContent></Card>
  );
}
export default EvolucaoCusto;
