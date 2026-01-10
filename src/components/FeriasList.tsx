// V14-044: FeriasList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";

interface Ferias {
  id: string;
  colaborador: string;
  periodoAquisitivo: string;
  dataInicio: string;
  dataFim: string;
  dias: number;
  status: "pendente" | "aprovado" | "rejeitado" | "gozando" | "concluido";
}

interface FeriasListProps {
  ferias: Ferias[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isLoading?: boolean;
}

const statusConfig = {
  pendente: { label: "Pendente", variant: "outline" as const },
  aprovado: { label: "Aprovado", variant: "default" as const },
  rejeitado: { label: "Rejeitado", variant: "destructive" as const },
  gozando: { label: "Em Gozo", variant: "secondary" as const },
  concluido: { label: "Concluído", variant: "secondary" as const },
};

export function FeriasList({ ferias, onAdd, onEdit, onDelete, onView, onApprove, onReject, isLoading }: FeriasListProps) {
  const [search, setSearch] = useState("");

  const filtered = ferias.filter((f) => f.colaborador.toLowerCase().includes(search.toLowerCase()));
  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar férias..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Nova Solicitação</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Período Aquisitivo</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead className="text-center">Dias</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Nenhuma férias encontrada</TableCell></TableRow>
            ) : (
              filtered.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.colaborador}</TableCell>
                  <TableCell>{f.periodoAquisitivo}</TableCell>
                  <TableCell>{formatDate(f.dataInicio)}</TableCell>
                  <TableCell>{formatDate(f.dataFim)}</TableCell>
                  <TableCell className="text-center">{f.dias}</TableCell>
                  <TableCell><Badge variant={statusConfig[f.status].variant}>{statusConfig[f.status].label}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(f.id)}><Eye className="mr-2 h-4 w-4" />Ver</DropdownMenuItem>
                        {f.status === "pendente" && onApprove && <DropdownMenuItem onClick={() => onApprove(f.id)}><CheckCircle className="mr-2 h-4 w-4" />Aprovar</DropdownMenuItem>}
                        {f.status === "pendente" && onReject && <DropdownMenuItem onClick={() => onReject(f.id)}><XCircle className="mr-2 h-4 w-4" />Rejeitar</DropdownMenuItem>}
                        <DropdownMenuItem onClick={() => onEdit?.(f.id)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(f.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

