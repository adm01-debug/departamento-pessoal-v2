// V14-051: PontoList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Clock } from "lucide-react";

interface Ponto {
  id: string;
  colaborador: string;
  data: string;
  entrada1?: string;
  saida1?: string;
  entrada2?: string;
  saida2?: string;
  horasTrabalhadas: string;
  tipo: "normal" | "hora_extra" | "falta" | "atestado" | "ferias" | "folga";
}

interface PontoListProps {
  pontos: Ponto[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

const tipoConfig = {
  normal: { label: "Normal", variant: "default" as const },
  hora_extra: { label: "H. Extra", variant: "secondary" as const },
  falta: { label: "Falta", variant: "destructive" as const },
  atestado: { label: "Atestado", variant: "outline" as const },
  ferias: { label: "Férias", variant: "secondary" as const },
  folga: { label: "Folga", variant: "outline" as const },
};

export function PontoList({ pontos, onAdd, onEdit, onDelete, isLoading }: PontoListProps) {
  const [search, setSearch] = useState("");

  const filtered = pontos.filter((p) =>
    p.colaborador.toLowerCase().includes(search.toLowerCase()) || p.data.includes(search)
  );

  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar registros..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Novo Registro</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Entrada 1</TableHead>
              <TableHead>Saída 1</TableHead>
              <TableHead>Entrada 2</TableHead>
              <TableHead>Saída 2</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8">Nenhum registro encontrado</TableCell></TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.colaborador}</TableCell>
                  <TableCell>{formatDate(p.data)}</TableCell>
                  <TableCell>{p.entrada1 || "-"}</TableCell>
                  <TableCell>{p.saida1 || "-"}</TableCell>
                  <TableCell>{p.entrada2 || "-"}</TableCell>
                  <TableCell>{p.saida2 || "-"}</TableCell>
                  <TableCell><div className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.horasTrabalhadas}</div></TableCell>
                  <TableCell><Badge variant={tipoConfig[p.tipo].variant}>{tipoConfig[p.tipo].label}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(p.id)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(p.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
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

