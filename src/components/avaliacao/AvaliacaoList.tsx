import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
const STATUS_COLORS: Record<string, string> = { PENDENTE: "bg-gray-100 text-gray-800", AUTOAVALIACAO: "bg-blue-100 text-blue-800", AVALIACAO_GESTOR: "bg-yellow-100 text-yellow-800", FEEDBACK: "bg-purple-100 text-purple-800", CONCLUIDA: "bg-green-100 text-green-800" };
export function AvaliacaoList({ avaliacoes = [], onView, onEdit }: any) {
  if (!avaliacoes.length) return <div className="text-center py-8 text-muted-foreground">Nenhuma avaliação encontrada</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Período</TableHead><TableHead>Status</TableHead><TableHead>Nota</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{avaliacoes.map((a: any) => <TableRow key={a.id}><TableCell className="font-medium">{a.colaboradorNome}</TableCell><TableCell>{a.tipo}</TableCell><TableCell>{a.periodo}</TableCell><TableCell><Badge className={STATUS_COLORS[a.status]}>{a.status}</Badge></TableCell><TableCell className="font-bold">{a.notaFinal?.toFixed(1) || "-"}</TableCell><TableCell className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => onView?.(a.id)}><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => onEdit?.(a.id)}><Edit className="w-4 h-4" /></Button></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default AvaliacaoList;
