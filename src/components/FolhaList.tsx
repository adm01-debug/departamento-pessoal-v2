// V14-046: FolhaList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Download, FileText } from "lucide-react";

interface Folha {
  id: string;
  competencia: string;
  tipo: string;
  empresa: string;
  totalBruto: number;
  totalDescontos: number;
  totalLiquido: number;
  colaboradoresCount: number;
  status: "rascunho" | "calculada" | "fechada" | "paga";
}

interface FolhaListProps {
  folhas: Folha[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onExport?: (id: string) => void;
  isLoading?: boolean;
}

const tipoLabels: Record<string, string> = {
  mensal: "Mensal", adiantamento: "Adiant.", ferias: "Férias",
  "13_primeira": "13º 1ª", "13_segunda": "13º 2ª", rescisao: "Rescisão",
};

const statusConfig = {
  rascunho: { label: "Rascunho", variant: "outline" as const },
  calculada: { label: "Calculada", variant: "secondary" as const },
  fechada: { label: "Fechada", variant: "default" as const },
  paga: { label: "Paga", variant: "default" as const },
};

export function FolhaList({ folhas, onAdd, onEdit, onDelete, onView, onExport, isLoading }: FolhaListProps) {
  const [search, setSearch] = useState("");

  const filtered = folhas.filter((f) =>
    f.competencia.includes(search) || f.empresa.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar folhas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Nova Folha</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competência</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead className="text-right">Total Bruto</TableHead>
              <TableHead className="text-right">Descontos</TableHead>
              <TableHead className="text-right">Líquido</TableHead>
              <TableHead className="text-center">Colab.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8">Nenhuma folha encontrada</TableCell></TableRow>
            ) : (
              filtered.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.competencia}</TableCell>
                  <TableCell><Badge variant="outline">{tipoLabels[f.tipo]}</Badge></TableCell>
                  <TableCell>{f.empresa}</TableCell>
                  <TableCell className="text-right">{formatCurrency(f.totalBruto)}</TableCell>
                  <TableCell className="text-right text-destructive">{formatCurrency(f.totalDescontos)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(f.totalLiquido)}</TableCell>
                  <TableCell className="text-center">{f.colaboradoresCount}</TableCell>
                  <TableCell><Badge variant={statusConfig[f.status].variant}>{statusConfig[f.status].label}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(f.id)}><Eye className="mr-2 h-4 w-4" />Ver</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExport?.(f.id)}><Download className="mr-2 h-4 w-4" />Exportar</DropdownMenuItem>
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

