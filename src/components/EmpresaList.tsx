// V14-041: EmpresaList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Building2, Check } from "lucide-react";

interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  colaboradoresCount: number;
  ativa: boolean;
  selecionada?: boolean;
}

interface EmpresaListProps {
  empresas: Empresa[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onSelect?: (id: string) => void;
  isLoading?: boolean;
}

export function EmpresaList({ empresas, onAdd, onEdit, onDelete, onView, onSelect, isLoading }: EmpresaListProps) {
  const [search, setSearch] = useState("");

  const filtered = empresas.filter((e) =>
    e.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
    e.nomeFantasia?.toLowerCase().includes(search.toLowerCase()) ||
    e.cnpj.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar empresas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Nova Empresa</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead className="text-center">Colaboradores</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Nenhuma empresa encontrada</TableCell></TableRow>
            ) : (
              filtered.map((e) => (
                <TableRow key={e.id} className={e.selecionada ? "bg-primary/5" : ""}>
                  <TableCell className="w-10">{e.selecionada && <Check className="h-4 w-4 text-primary" />}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{e.nomeFantasia || e.razaoSocial}</div>
                        {e.nomeFantasia && <div className="text-xs text-muted-foreground">{e.razaoSocial}</div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{e.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}</TableCell>
                  <TableCell className="text-center">{e.colaboradoresCount}</TableCell>
                  <TableCell><Badge variant={e.ativa ? "default" : "secondary"}>{e.ativa ? "Ativa" : "Inativa"}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelect?.(e.id)}>Selecionar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView?.(e.id)}><Eye className="mr-2 h-4 w-4" />Ver</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(e.id)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(e.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
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

