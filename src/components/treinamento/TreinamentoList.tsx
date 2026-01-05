import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Users } from "lucide-react";
const TIPO_COLORS: Record<string, string> = { NR: "bg-red-100 text-red-800", OBRIGATORIO: "bg-yellow-100 text-yellow-800", TECNICO: "bg-blue-100 text-blue-800", COMPORTAMENTAL: "bg-purple-100 text-purple-800" };
export function TreinamentoList({ treinamentos = [], onEdit, onDelete, onInscrever }: any) {
  if (!treinamentos.length) return <div className="text-center py-8 text-muted-foreground">Nenhum treinamento cadastrado</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Modalidade</TableHead><TableHead>Carga Horária</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{treinamentos.map((t: any) => <TableRow key={t.id}><TableCell className="font-medium">{t.nome}</TableCell><TableCell><Badge className={TIPO_COLORS[t.tipo] || ""}>{t.tipo}</Badge></TableCell><TableCell>{t.modalidade}</TableCell><TableCell>{t.cargaHoraria}h</TableCell><TableCell><Badge variant={t.ativo ? "default" : "secondary"}>{t.ativo ? "Ativo" : "Inativo"}</Badge></TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => onInscrever?.(t.id)}><Users className="w-4 h-4 mr-2" />Inscrever</DropdownMenuItem><DropdownMenuItem onClick={() => onEdit?.(t.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => onDelete?.(t.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default TreinamentoList;
