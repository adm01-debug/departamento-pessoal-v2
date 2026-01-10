// V14-028: ColaboradorList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, FileText } from "lucide-react";

interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: "ativo" | "ferias" | "afastado" | "desligado";
  avatarUrl?: string;
}

interface ColaboradorListProps {
  colaboradores: Colaborador[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  isLoading?: boolean;
}

const statusConfig = {
  ativo: { label: "Ativo", variant: "default" as const },
  ferias: { label: "Férias", variant: "secondary" as const },
  afastado: { label: "Afastado", variant: "outline" as const },
  desligado: { label: "Desligado", variant: "destructive" as const },
};

export function ColaboradorList({ colaboradores, onAdd, onEdit, onDelete, onView, isLoading }: ColaboradorListProps) {
  const [search, setSearch] = useState("");

  const filtered = colaboradores.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.cpf.includes(search) ||
    c.cargo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar colaboradores..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Novo Colaborador</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Admissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Nenhum colaborador encontrado</TableCell></TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={c.avatarUrl} />
                        <AvatarFallback>{c.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{c.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{c.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</TableCell>
                  <TableCell>{c.cargo}</TableCell>
                  <TableCell>{c.departamento}</TableCell>
                  <TableCell>{new Date(c.dataAdmissao).toLocaleDateString("pt-BR")}</TableCell>
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

