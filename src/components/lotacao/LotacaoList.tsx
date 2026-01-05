import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, FolderTree } from "lucide-react";
export function LotacaoList({ lotacoes, onEdit, onDelete, isLoading }: any) {
  if (isLoading) return <div>Carregando...</div>;
  if (!lotacoes?.length) return <div className="text-center py-8 text-muted-foreground"><FolderTree className="w-12 h-12 mx-auto mb-4 opacity-50" />Nenhuma lotação encontrada</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Descrição</TableHead><TableHead>Tipo</TableHead><TableHead>Cód. Contábil</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{lotacoes.map((l:any) => <TableRow key={l.id}><TableCell className="font-medium">{l.codigo}</TableCell><TableCell>{l.descricao}</TableCell><TableCell><Badge variant="outline">{l.tipo}</Badge></TableCell><TableCell>{l.codigoContabil || "-"}</TableCell><TableCell><Badge variant={l.ativo ? "default" : "secondary"}>{l.ativo ? "Ativo" : "Inativo"}</Badge></TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => onEdit?.(l.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => onDelete?.(l.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default LotacaoList;
