// V14-032: ContratoList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, FileText } from "lucide-react";

interface Contrato {
  id: string;
  colaborador: string;
  tipo: string;
  dataInicio: string;
  dataFim?: string;
  salario: number;
  status: "vigente" | "encerrado" | "suspenso";
}

interface ContratoListProps {
  contratos: Contrato[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  isLoading?: boolean;
}

const tipoLabels: Record<string, string> = {
  clt: "CLT", pj: "PJ", estagio: "Estágio", temporario: "Temporário", intermitente: "Intermitente",
};

const statusConfig = {
  vigente: { label: "Vigente", variant: "default" as const },
  encerrado: { label: "Encerrado", variant: "secondary" as const },
  suspenso: { label: "Suspenso", variant: "outline" as const },
};

export function ContratoList({ contratos, onAdd, onEdit, onDelete, onView, isLoading }: ContratoListProps) {
  const [search, setSearch] = useState("");

  const filtered = contratos.filter((c) =>
    c.colaborador.toLowerCase().includes(search.toLowerCase()) ||
    tipoLabels[c.tipo]?.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar contratos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Novo Contrato</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Término</TableHead>
              <TableHead className="text-right">Salário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Nenhum contrato encontrado</TableCell></TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.colaborador}</TableCell>
                  <TableCell><Badge variant="outline">{tipoLabels[c.tipo]}</Badge></TableCell>
                  <TableCell>{formatDate(c.dataInicio)}</TableCell>
                  <TableCell>{c.dataFim ? formatDate(c.dataFim) : "Indeterminado"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(c.salario)}</TableCell>
                  <TableCell><Badge variant={statusConfig[c.status].variant}>{statusConfig[c.status].label}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(c.id)}><Eye className="mr-2 h-4 w-4" />Ver</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(c.id)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(c.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
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

