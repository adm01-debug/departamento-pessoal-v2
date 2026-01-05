import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface FolhaSinteticaProps { competencia: string; resumo: { rubrica: string; tipo: "PROVENTO" | "DESCONTO"; quantidade: number; valor: number }[]; totais: { colaboradores: number; proventos: number; descontos: number; liquido: number }; }
export function FolhaSintetica({ competencia, resumo, totais }: FolhaSinteticaProps) {
  const proventos = resumo.filter(r => r.tipo === "PROVENTO");
  const descontos = resumo.filter(r => r.tipo === "DESCONTO");
  return (
    <Card>
      <CardHeader><CardTitle>Folha de Pagamento Sintética</CardTitle><p className="text-sm text-muted-foreground">Competência: {competencia} | {totais.colaboradores} colaboradores</p></CardHeader>
      <CardContent className="space-y-6">
        <div><h3 className="font-semibold text-green-600 mb-2">Proventos</h3><Table><TableHeader><TableRow><TableHead>Rubrica</TableHead><TableHead className="text-right">Qtd</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader><TableBody>{proventos.map((p, i) => <TableRow key={i}><TableCell>{p.rubrica}</TableCell><TableCell className="text-right">{p.quantidade}</TableCell><TableCell className="text-right">R$ {p.valor.toFixed(2)}</TableCell></TableRow>)}<TableRow className="font-bold"><TableCell>TOTAL PROVENTOS</TableCell><TableCell></TableCell><TableCell className="text-right text-green-600">R$ {totais.proventos.toFixed(2)}</TableCell></TableRow></TableBody></Table></div>
        <div><h3 className="font-semibold text-red-600 mb-2">Descontos</h3><Table><TableHeader><TableRow><TableHead>Rubrica</TableHead><TableHead className="text-right">Qtd</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader><TableBody>{descontos.map((d, i) => <TableRow key={i}><TableCell>{d.rubrica}</TableCell><TableCell className="text-right">{d.quantidade}</TableCell><TableCell className="text-right">R$ {d.valor.toFixed(2)}</TableCell></TableRow>)}<TableRow className="font-bold"><TableCell>TOTAL DESCONTOS</TableCell><TableCell></TableCell><TableCell className="text-right text-red-600">R$ {totais.descontos.toFixed(2)}</TableCell></TableRow></TableBody></Table></div>
        <div className="p-4 bg-primary/10 rounded text-center"><span className="text-lg">LÍQUIDO A PAGAR:</span><p className="text-3xl font-bold">R$ {totais.liquido.toFixed(2)}</p></div>
      </CardContent>
    </Card>
  );
}
export default FolhaSintetica;
