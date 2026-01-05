import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const TIPO_COLORS: Record<string, string> = { SEM_JUSTA_CAUSA: "bg-blue-100 text-blue-800", JUSTA_CAUSA: "bg-red-100 text-red-800", PEDIDO: "bg-yellow-100 text-yellow-800", ACORDO: "bg-green-100 text-green-800" };
export function DemissaoList({ demissoes = [], onEdit, onView }: any) {
  if (!demissoes.length) return <div className="text-center py-8 text-muted-foreground">Nenhuma demissão registrada</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Data</TableHead><TableHead>Tipo</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{demissoes.map((d: any) => <TableRow key={d.id}><TableCell className="font-medium">{d.colaboradorNome}</TableCell><TableCell>{d.data}</TableCell><TableCell><Badge className={TIPO_COLORS[d.tipo]}>{d.tipo}</Badge></TableCell><TableCell><Badge variant="outline">{d.status}</Badge></TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => onView?.(d.id)}><Eye className="w-4 h-4 mr-2" />Visualizar</DropdownMenuItem><DropdownMenuItem onClick={() => onEdit?.(d.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default DemissaoList;
