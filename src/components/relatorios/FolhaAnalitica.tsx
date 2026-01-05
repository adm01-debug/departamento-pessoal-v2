import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
interface FolhaAnaliticaProps { competencia: string; colaboradores: { nome: string; cargo: string; proventos: { rubrica: string; valor: number }[]; descontos: { rubrica: string; valor: number }[]; liquido: number }[]; }
export function FolhaAnalitica({ competencia, colaboradores }: FolhaAnaliticaProps) {
  const totalProventos = colaboradores.reduce((acc, c) => acc + c.proventos.reduce((a, p) => a + p.valor, 0), 0);
  const totalDescontos = colaboradores.reduce((acc, c) => acc + c.descontos.reduce((a, d) => a + d.valor, 0), 0);
  const totalLiquido = colaboradores.reduce((acc, c) => acc + c.liquido, 0);
  return (
    <Card className="print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle>Folha de Pagamento Analítica</CardTitle><p className="text-sm text-muted-foreground">Competência: {competencia}</p></div>
        <div className="flex gap-2 print:hidden"><Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" />Imprimir</Button><Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Exportar</Button></div>
      </CardHeader>
      <CardContent>
        {colaboradores.map((col, i) => (
          <div key={i} className="mb-6 border-b pb-4">
            <h3 className="font-semibold mb-2">{col.nome} - {col.cargo}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><h4 className="text-sm font-medium text-green-600">Proventos</h4><Table><TableBody>{col.proventos.map((p, j) => <TableRow key={j}><TableCell>{p.rubrica}</TableCell><TableCell className="text-right">R$ {p.valor.toFixed(2)}</TableCell></TableRow>)}</TableBody></Table></div>
              <div><h4 className="text-sm font-medium text-red-600">Descontos</h4><Table><TableBody>{col.descontos.map((d, j) => <TableRow key={j}><TableCell>{d.rubrica}</TableCell><TableCell className="text-right">R$ {d.valor.toFixed(2)}</TableCell></TableRow>)}</TableBody></Table></div>
            </div>
            <div className="text-right mt-2 font-bold">Líquido: R$ {col.liquido.toFixed(2)}</div>
          </div>
        ))}
        <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-muted rounded"><div><span className="text-sm">Total Proventos</span><p className="text-xl font-bold text-green-600">R$ {totalProventos.toFixed(2)}</p></div><div><span className="text-sm">Total Descontos</span><p className="text-xl font-bold text-red-600">R$ {totalDescontos.toFixed(2)}</p></div><div><span className="text-sm">Total Líquido</span><p className="text-xl font-bold">R$ {totalLiquido.toFixed(2)}</p></div></div>
      </CardContent>
    </Card>
  );
}
export default FolhaAnalitica;
