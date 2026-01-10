// V14-036: DependenteList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Check, X } from "lucide-react";

interface Dependente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  parentesco: string;
  irrf: boolean;
  salarioFamilia: boolean;
  planoSaude: boolean;
}

interface DependenteListProps {
  dependentes: Dependente[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

const parentescoLabels: Record<string, string> = {
  conjuge: "Cônjuge", filho: "Filho(a)", enteado: "Enteado(a)", pai: "Pai", mae: "Mãe", outro: "Outro",
};

export function DependenteList({ dependentes, onAdd, onEdit, onDelete, isLoading }: DependenteListProps) {
  const [search, setSearch] = useState("");

  const filtered = dependentes.filter((d) =>
    d.nome.toLowerCase().includes(search.toLowerCase()) || d.cpf.includes(search)
  );

  const BoolIcon = ({ value }: { value: boolean }) => value ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar dependentes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Novo Dependente</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Nascimento</TableHead>
              <TableHead>Parentesco</TableHead>
              <TableHead className="text-center">IRRF</TableHead>
              <TableHead className="text-center">Sal.Fam</TableHead>
              <TableHead className="text-center">Plano</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8">Nenhum dependente encontrado</TableCell></TableRow>
            ) : (
              filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.nome}</TableCell>
                  <TableCell className="font-mono text-sm">{d.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</TableCell>
                  <TableCell>{new Date(d.dataNascimento).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell><Badge variant="outline">{parentescoLabels[d.parentesco]}</Badge></TableCell>
                  <TableCell><BoolIcon value={d.irrf} /></TableCell>
                  <TableCell><BoolIcon value={d.salarioFamilia} /></TableCell>
                  <TableCell><BoolIcon value={d.planoSaude} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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

