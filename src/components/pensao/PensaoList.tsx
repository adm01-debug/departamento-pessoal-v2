import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
export function PensaoList({ pensoes = [], onEdit, onDelete }: any) {
  if (!pensoes.length) return <div className="text-center py-8 text-muted-foreground">Nenhuma pensão cadastrada</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Beneficiário</TableHead><TableHead>Tipo</TableHead><TableHead>Valor/Percentual</TableHead><TableHead>Processo</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{pensoes.map((p: any) => <TableRow key={p.id}><TableCell className="font-medium">{p.beneficiario}</TableCell><TableCell>{p.tipoCalculo}</TableCell><TableCell>{p.tipoCalculo === "PERCENTUAL" ? `${p.percentual}%` : `R$ ${p.valorFixo?.toFixed(2)}`}</TableCell><TableCell>{p.numeroProcesso || "-"}</TableCell><TableCell><Badge variant={p.ativo ? "default" : "secondary"}>{p.ativo ? "Ativa" : "Inativa"}</Badge></TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => onEdit?.(p.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => onDelete?.(p.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default PensaoList;
