import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, DollarSign } from "lucide-react";
const TIPO_COLORS: Record<string, string> = { PROVENTO: "bg-green-100 text-green-800", DESCONTO: "bg-red-100 text-red-800", INFORMATIVA: "bg-blue-100 text-blue-800" };
export function RubricaList({ rubricas, onEdit, onDelete, isLoading }: any) {
  if (isLoading) return <div>Carregando...</div>;
  if (!rubricas?.length) return <div className="text-center py-8 text-muted-foreground"><DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />Nenhuma rubrica encontrada</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Descrição</TableHead><TableHead>Tipo</TableHead><TableHead>Natureza</TableHead><TableHead>Incidências</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{rubricas.map((r:any) => <TableRow key={r.id}><TableCell className="font-medium">{r.codigo}</TableCell><TableCell>{r.descricao}</TableCell><TableCell><Badge className={TIPO_COLORS[r.tipo]}>{r.tipo}</Badge></TableCell><TableCell className="text-sm">{r.natureza}</TableCell><TableCell className="text-xs">{[r.incideINSS && "INSS", r.incideIRRF && "IRRF", r.incideFGTS && "FGTS"].filter(Boolean).join(", ") || "-"}</TableCell><TableCell><Badge variant={r.ativo ? "default" : "secondary"}>{r.ativo ? "Ativo" : "Inativo"}</Badge></TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => onEdit?.(r.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => onDelete?.(r.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default RubricaList;
