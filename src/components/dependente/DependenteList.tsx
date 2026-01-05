import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
export function DependenteList({ dependentes = [], onEdit, onDelete }: any) {
  if (!dependentes.length) return <div className="text-center py-8 text-muted-foreground">Nenhum dependente cadastrado</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Parentesco</TableHead><TableHead>Data Nasc.</TableHead><TableHead>IRRF</TableHead><TableHead>Sal.Família</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{dependentes.map((d: any) => <TableRow key={d.id}><TableCell className="font-medium">{d.nome}</TableCell><TableCell>{d.parentesco}</TableCell><TableCell>{d.dataNascimento}</TableCell><TableCell>{d.irrf ? <Badge className="bg-green-100 text-green-800">Sim</Badge> : "-"}</TableCell><TableCell>{d.salarioFamilia ? <Badge className="bg-blue-100 text-blue-800">Sim</Badge> : "-"}</TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => onEdit?.(d.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => onDelete?.(d.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default DependenteList;
