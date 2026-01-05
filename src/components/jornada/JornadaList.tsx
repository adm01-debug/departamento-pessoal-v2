import React from "react";
import { Jornada } from "@/types/jornada.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface JornadaListProps {
  jornadas: Jornada[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

const TIPO_COLORS: Record<string, string> = {
  NORMAL: "bg-blue-100 text-blue-800",
  FLEXIVEL: "bg-purple-100 text-purple-800",
  ESCALA: "bg-orange-100 text-orange-800",
  PLANTAO: "bg-red-100 text-red-800",
  INTERMITENTE: "bg-gray-100 text-gray-800",
};

export function JornadaList({ jornadas, onEdit, onDelete, isLoading }: JornadaListProps) {
  if (isLoading) {
    return <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;
  }

  if (jornadas.length === 0) {
    return <div className="text-center py-12 text-muted-foreground"><Clock className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Nenhuma jornada encontrada</p></div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Horário</TableHead>
          <TableHead>Carga Diária</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jornadas.map(jornada => (
          <TableRow key={jornada.id}>
            <TableCell className="font-medium">{jornada.codigo}</TableCell>
            <TableCell>{jornada.descricao}</TableCell>
            <TableCell>{jornada.horaInicio} - {jornada.horaFim}</TableCell>
            <TableCell>{jornada.cargaHorariaDiaria}h</TableCell>
            <TableCell><Badge className={TIPO_COLORS[jornada.tipo]}>{jornada.tipo}</Badge></TableCell>
            <TableCell><Badge variant={jornada.ativo ? "default" : "secondary"}>{jornada.ativo ? "Ativo" : "Inativo"}</Badge></TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(jornada.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete?.(jornada.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default JornadaList;
