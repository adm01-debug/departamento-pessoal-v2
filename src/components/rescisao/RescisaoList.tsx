import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Printer } from "lucide-react";
export function RescisaoList({ rescisoes = [], onView, onPrint }: any) {
  if (!rescisoes.length) return <div className="text-center py-8 text-muted-foreground">Nenhuma rescisão encontrada</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Data Cálculo</TableHead><TableHead className="text-right">Proventos</TableHead><TableHead className="text-right">Descontos</TableHead><TableHead className="text-right">Líquido</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{rescisoes.map((r: any) => <TableRow key={r.id}><TableCell className="font-medium">{r.colaboradorNome}</TableCell><TableCell>{r.dataCalculo}</TableCell><TableCell className="text-right text-green-600">R$ {r.totalProventos?.toFixed(2)}</TableCell><TableCell className="text-right text-red-600">R$ {r.totalDescontos?.toFixed(2)}</TableCell><TableCell className="text-right font-bold">R$ {r.liquido?.toFixed(2)}</TableCell><TableCell><Badge variant={r.pago ? "default" : "secondary"}>{r.pago ? "Pago" : "Pendente"}</Badge></TableCell><TableCell className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => onView?.(r.id)}><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => onPrint?.(r.id)}><Printer className="w-4 h-4" /></Button></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default RescisaoList;
