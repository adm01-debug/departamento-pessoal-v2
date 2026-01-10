// V14-021: AfastamentoList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Edit, Trash2, Eye, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Afastamento {
  id: string;
  colaborador: { id: string; nome: string };
  tipo: string;
  dataInicio: string;
  dataFim?: string;
  status: "ativo" | "finalizado" | "cancelado";
  motivo: string;
  cid?: string;
}

interface AfastamentoListProps {
  afastamentos: Afastamento[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const statusColors = {
  ativo: "bg-blue-500",
  finalizado: "bg-green-500",
  cancelado: "bg-red-500",
};

const tipoLabels: Record<string, string> = {
  doenca: "Doença",
  acidente_trabalho: "Acidente de Trabalho",
  licenca_maternidade: "Licença Maternidade",
  licenca_paternidade: "Licença Paternidade",
  licenca_casamento: "Licença Casamento",
  licenca_obito: "Licença Óbito",
  servico_militar: "Serviço Militar",
  outros: "Outros",
};

export function AfastamentoList({ afastamentos, onAdd, onEdit, onDelete, onView }: AfastamentoListProps) {
  const [search, setSearch] = useState("");

  const filtered = afastamentos.filter((a) =>
    a.colaborador.nome.toLowerCase().includes(search.toLowerCase()) ||
    a.motivo.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Afastamentos</CardTitle>
        <Button onClick={onAdd}><Plus className="h-4 w-4 mr-2" />Novo Afastamento</Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar afastamentos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CID</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum afastamento encontrado</TableCell></TableRow>
            ) : (
              filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.colaborador.nome}</TableCell>
                  <TableCell>{tipoLabels[a.tipo] || a.tipo}</TableCell>
                  <TableCell>{formatDate(a.dataInicio)}</TableCell>
                  <TableCell>{a.dataFim ? formatDate(a.dataFim) : "-"}</TableCell>
                  <TableCell><Badge className={statusColors[a.status]}>{a.status}</Badge></TableCell>
                  <TableCell>{a.cid || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(a.id)}><Eye className="h-4 w-4 mr-2" />Visualizar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(a.id)}><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(a.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

