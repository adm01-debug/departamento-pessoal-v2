// V14-022: BeneficioList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

interface Beneficio {
  id: string;
  tipo: string;
  descricao: string;
  valorEmpresa: number;
  valorColaborador: number;
  ativo: boolean;
  colaboradoresCount: number;
}

interface BeneficioListProps {
  beneficios: Beneficio[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  isLoading?: boolean;
}

const tipoLabels: Record<string, string> = {
  vale_transporte: "Vale Transporte",
  vale_refeicao: "Vale Refeição",
  vale_alimentacao: "Vale Alimentação",
  plano_saude: "Plano de Saúde",
  plano_odonto: "Plano Odontológico",
  seguro_vida: "Seguro de Vida",
  outro: "Outro",
};

export function BeneficioList({ beneficios, onAdd, onEdit, onDelete, onView, isLoading }: BeneficioListProps) {
  const [search, setSearch] = useState("");

  const filtered = beneficios.filter(
    (b) =>
      b.descricao.toLowerCase().includes(search.toLowerCase()) ||
      tipoLabels[b.tipo]?.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar benefícios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Benefício
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor Empresa</TableHead>
              <TableHead className="text-right">Desc. Colaborador</TableHead>
              <TableHead className="text-center">Colaboradores</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum benefício encontrado
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((beneficio) => (
                <TableRow key={beneficio.id}>
                  <TableCell>
                    <Badge variant="outline">{tipoLabels[beneficio.tipo] || beneficio.tipo}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{beneficio.descricao}</TableCell>
                  <TableCell className="text-right">{formatCurrency(beneficio.valorEmpresa)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(beneficio.valorColaborador)}</TableCell>
                  <TableCell className="text-center">{beneficio.colaboradoresCount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={beneficio.ativo ? "default" : "secondary"}>
                      {beneficio.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(beneficio.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(beneficio.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(beneficio.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
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

