import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, CreditCard } from "lucide-react";
import { Progress } from "@/components/ui/progress";
const SIT_COLORS: Record<string, string> = { ATIVO: "bg-blue-100 text-blue-800", QUITADO: "bg-green-100 text-green-800", CANCELADO: "bg-red-100 text-red-800", SUSPENSO: "bg-yellow-100 text-yellow-800" };
export function EmprestimoList({ emprestimos, onEdit, onDelete, isLoading }: any) {
  if (isLoading) return <div>Carregando...</div>;
  if (!emprestimos?.length) return <div className="text-center py-8 text-muted-foreground"><CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />Nenhum empréstimo encontrado</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Contrato</TableHead><TableHead>Valor Total</TableHead><TableHead>Parcelas</TableHead><TableHead>Progresso</TableHead><TableHead>Situação</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{emprestimos.map((e:any) => <TableRow key={e.id}><TableCell><Badge variant="outline">{e.tipo}</Badge></TableCell><TableCell>{e.contrato || "-"}</TableCell><TableCell>R$ {e.valorTotal?.toFixed(2)}</TableCell><TableCell>{e.parcelasPagas}/{e.quantidadeParcelas}</TableCell><TableCell><Progress value={(e.parcelasPagas/e.quantidadeParcelas)*100} className="h-2" /></TableCell><TableCell><Badge className={SIT_COLORS[e.situacao]}>{e.situacao}</Badge></TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => onEdit?.(e.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => onDelete?.(e.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default EmprestimoList;
