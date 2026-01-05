import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
const TIPO_COLORS: Record<string, string> = { PROVENTO: "bg-green-100 text-green-800", DESCONTO: "bg-red-100 text-red-800", INFORMATIVO: "bg-blue-100 text-blue-800" };
export function EventoList({ eventos = [], onDelete }: any) {
  if (!eventos.length) return <div className="text-center py-8 text-muted-foreground">Nenhum evento lançado</div>;
  const totalProventos = eventos.filter((e: any) => e.tipo === "PROVENTO").reduce((acc: number, e: any) => acc + e.valor, 0);
  const totalDescontos = eventos.filter((e: any) => e.tipo === "DESCONTO").reduce((acc: number, e: any) => acc + e.valor, 0);
  return (
    <div className="space-y-4">
      <Table><TableHeader><TableRow><TableHead>Rubrica</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Ref.</TableHead><TableHead className="text-right">Valor</TableHead><TableHead>Origem</TableHead><TableHead></TableHead></TableRow></TableHeader>
      <TableBody>{eventos.map((e: any) => <TableRow key={e.id}><TableCell>{e.rubricaNome || e.rubricaId}</TableCell><TableCell><Badge className={TIPO_COLORS[e.tipo]}>{e.tipo}</Badge></TableCell><TableCell className="text-right">{e.referencia || "-"}</TableCell><TableCell className={`text-right font-medium ${e.tipo === "DESCONTO" ? "text-red-600" : "text-green-600"}`}>R$ {e.valor.toFixed(2)}</TableCell><TableCell><Badge variant="outline">{e.origem}</Badge></TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => onDelete?.(e.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></TableCell></TableRow>)}</TableBody></Table>
      <div className="flex justify-end gap-4 p-4 bg-muted rounded"><div className="text-right"><span className="text-sm text-muted-foreground">Proventos:</span><span className="ml-2 font-bold text-green-600">R$ {totalProventos.toFixed(2)}</span></div><div className="text-right"><span className="text-sm text-muted-foreground">Descontos:</span><span className="ml-2 font-bold text-red-600">R$ {totalDescontos.toFixed(2)}</span></div><div className="text-right"><span className="text-sm text-muted-foreground">Líquido:</span><span className="ml-2 font-bold text-lg">R$ {(totalProventos - totalDescontos).toFixed(2)}</span></div></div>
    </div>
  );
}
export default EventoList;
