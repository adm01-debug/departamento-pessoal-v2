import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
export function SindicatoList({ sindicatos = [], onEdit, onDelete }: any) {
  if (!sindicatos.length) return <div className="text-center py-8 text-muted-foreground">Nenhum sindicato cadastrado</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Nome</TableHead><TableHead>CNPJ</TableHead><TableHead>Cidade/UF</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{sindicatos.map((s: any) => <TableRow key={s.id}><TableCell className="font-medium">{s.codigo}</TableCell><TableCell>{s.nome}</TableCell><TableCell>{s.cnpj || "-"}</TableCell><TableCell>{s.cidade ? `${s.cidade}/${s.uf}` : "-"}</TableCell><TableCell><Badge variant={s.ativo ? "default" : "secondary"}>{s.ativo ? "Ativo" : "Inativo"}</Badge></TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => onEdit?.(s.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => onDelete?.(s.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default SindicatoList;
