import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, FileCheck, AlertTriangle } from "lucide-react";
const TIPO_COLORS: Record<string, string> = { INDETERMINADO: "bg-green-100 text-green-800", DETERMINADO: "bg-blue-100 text-blue-800", EXPERIENCIA: "bg-yellow-100 text-yellow-800", ESTAGIO: "bg-purple-100 text-purple-800", APRENDIZ: "bg-pink-100 text-pink-800" };
export function ContratoList({ contratos = [], onEdit }: any) {
  if (!contratos.length) return <div className="text-center py-8 text-muted-foreground">Nenhum contrato cadastrado</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Número</TableHead><TableHead>Tipo</TableHead><TableHead>Início</TableHead><TableHead>Regime</TableHead><TableHead>Assinado</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{contratos.map((c: any) => <TableRow key={c.id}><TableCell className="font-medium">{c.numero || "-"}</TableCell><TableCell><Badge className={TIPO_COLORS[c.tipo] || "bg-gray-100"}>{c.tipo}</Badge></TableCell><TableCell>{c.dataInicio}</TableCell><TableCell>{c.regimeTrabalho}</TableCell><TableCell>{c.assinado ? <Badge className="bg-green-100 text-green-800"><FileCheck className="w-3 h-3 mr-1" />Sim</Badge> : <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />Pendente</Badge>}</TableCell><TableCell><Badge variant={c.ativo ? "default" : "secondary"}>{c.ativo ? "Ativo" : "Inativo"}</Badge></TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => onEdit?.(c.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default ContratoList;
