import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
export function VinculoList({ vinculos, onEdit, onDelete, isLoading }: any) {
  if (isLoading) return <div>Carregando...</div>;
  if (!vinculos?.length) return <div className="text-center py-8 text-muted-foreground">Nenhum vínculo encontrado</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Matrícula</TableHead><TableHead>Tipo</TableHead><TableHead>Admissão</TableHead><TableHead>Salário</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{vinculos.map((v:any) => <TableRow key={v.id}><TableCell className="font-medium">{v.matricula}</TableCell><TableCell><Badge variant="outline">{v.tipoVinculo}</Badge></TableCell><TableCell>{v.dataAdmissao}</TableCell><TableCell>R$ {v.salarioBase?.toFixed(2)}</TableCell><TableCell><Badge variant={v.ativo ? "default" : "secondary"}>{v.ativo ? "Ativo" : "Inativo"}</Badge></TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => onEdit?.(v.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => onDelete?.(v.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default VinculoList;
