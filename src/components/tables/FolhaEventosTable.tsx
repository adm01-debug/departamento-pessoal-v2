import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatters } from "@/utils/formatters";
interface EventoFolha { id: string; colaborador: string; rubrica: string; tipo: "PROVENTO" | "DESCONTO"; referencia?: number; valor: number; }
interface FolhaEventosTableProps { data: EventoFolha[]; }
export function FolhaEventosTable({ data }: FolhaEventosTableProps) {
  const totais = { proventos: data.filter(e => e.tipo === "PROVENTO").reduce((a, e) => a + e.valor, 0), descontos: data.filter(e => e.tipo === "DESCONTO").reduce((a, e) => a + e.valor, 0) };
  return (<div><Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Rubrica</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Ref.</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader><TableBody>{data.map(e => <TableRow key={e.id}><TableCell>{e.colaborador}</TableCell><TableCell>{e.rubrica}</TableCell><TableCell><Badge variant={e.tipo === "PROVENTO" ? "default" : "destructive"}>{e.tipo}</Badge></TableCell><TableCell className="text-right">{e.referencia || "-"}</TableCell><TableCell className={`text-right font-medium ${e.tipo === "PROVENTO" ? "text-green-600" : "text-red-600"}`}>{formatters.moeda(e.valor)}</TableCell></TableRow>)}</TableBody></Table><div className="flex justify-end gap-4 mt-4 p-4 bg-muted rounded-lg"><div><span className="text-sm text-muted-foreground">Proventos:</span><span className="ml-2 font-bold text-green-600">{formatters.moeda(totais.proventos)}</span></div><div><span className="text-sm text-muted-foreground">Descontos:</span><span className="ml-2 font-bold text-red-600">{formatters.moeda(totais.descontos)}</span></div><div><span className="text-sm text-muted-foreground">Líquido:</span><span className="ml-2 font-bold">{formatters.moeda(totais.proventos - totais.descontos)}</span></div></div></div>);
}
export default FolhaEventosTable;
