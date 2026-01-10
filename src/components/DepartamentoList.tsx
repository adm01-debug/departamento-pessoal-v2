// V14-034: DepartamentoList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Users } from "lucide-react";

interface Departamento {
  id: string;
  nome: string;
  sigla?: string;
  responsavel?: string;
  centroCusto?: string;
  colaboradoresCount: number;
}

interface DepartamentoListProps {
  departamentos: Departamento[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  isLoading?: boolean;
}

export function DepartamentoList({ departamentos, onAdd, onEdit, onDelete, onView, isLoading }: DepartamentoListProps) {
  const [search, setSearch] = useState("");

  const filtered = departamentos.filter((d) =>
    d.nome.toLowerCase().includes(search.toLowerCase()) ||
    d.sigla?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar departamentos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Novo Departamento</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Sigla</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Centro Custo</TableHead>
              <TableHead className="text-center"><Users className="h-4 w-4 mx-auto" /></TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Nenhum departamento encontrado</TableCell></TableRow>
            ) : (
              filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.nome}</TableCell>
                  <TableCell>{d.sigla || "-"}</TableCell>
                  <TableCell>{d.responsavel || "-"}</TableCell>
                  <TableCell>{d.centroCusto || "-"}</TableCell>
                  <TableCell className="text-center">{d.colaboradoresCount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(d.id)}><Eye className="mr-2 h-4 w-4" />Ver</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(d.id)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(d.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
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

