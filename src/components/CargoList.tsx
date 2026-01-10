// V14-024: CargoList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Users } from "lucide-react";

interface Cargo {
  id: string;
  nome: string;
  cbo: string;
  departamento: string;
  nivelHierarquico: string;
  salarioBase: number;
  colaboradoresCount: number;
}

interface CargoListProps {
  cargos: Cargo[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  isLoading?: boolean;
}

const nivelLabels: Record<string, string> = {
  operacional: "Operacional",
  tecnico: "Técnico",
  supervisao: "Supervisão",
  gerencia: "Gerência",
  diretoria: "Diretoria",
};

export function CargoList({ cargos, onAdd, onEdit, onDelete, onView, isLoading }: CargoListProps) {
  const [search, setSearch] = useState("");

  const filtered = cargos.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.cbo.includes(search) ||
      c.departamento.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cargos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cargo
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CBO</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">Salário Base</TableHead>
              <TableHead className="text-center">
                <Users className="h-4 w-4 mx-auto" />
              </TableHead>
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
                  Nenhum cargo encontrado
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cargo) => (
                <TableRow key={cargo.id}>
                  <TableCell className="font-medium">{cargo.nome}</TableCell>
                  <TableCell className="font-mono text-sm">{cargo.cbo}</TableCell>
                  <TableCell>{cargo.departamento}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{nivelLabels[cargo.nivelHierarquico]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(cargo.salarioBase)}</TableCell>
                  <TableCell className="text-center">{cargo.colaboradoresCount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(cargo.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(cargo.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(cargo.id)} className="text-destructive">
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

