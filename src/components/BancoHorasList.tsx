// V14-027: BancoHorasList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LancamentoBancoHoras {
  id: string;
  colaborador: { id: string; nome: string };
  tipo: "credito" | "debito";
  horas: number;
  minutos: number;
  data: string;
  motivo: string;
  saldoAtual: number;
}

interface BancoHorasListProps {
  lancamentos: LancamentoBancoHoras[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BancoHorasList({ lancamentos, onAdd, onEdit, onDelete }: BancoHorasListProps) {
  const [search, setSearch] = useState("");

  const filtered = lancamentos.filter((l) =>
    l.colaborador.nome.toLowerCase().includes(search.toLowerCase()) ||
    l.motivo.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");
  const formatHoras = (horas: number, minutos: number) => `${horas}h${minutos > 0 ? ` ${minutos}min` : ""}`;
  const formatSaldo = (saldo: number) => {
    const horas = Math.floor(Math.abs(saldo) / 60);
    const mins = Math.abs(saldo) % 60;
    const sinal = saldo >= 0 ? "+" : "-";
    return `${sinal}${horas}h${mins > 0 ? ` ${mins}min` : ""}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Banco de Horas</CardTitle>
        <Button onClick={onAdd}><Plus className="h-4 w-4 mr-2" />Novo Lançamento</Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar lançamentos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Horas</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Saldo Atual</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum lançamento encontrado</TableCell></TableRow>
            ) : (
              filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.colaborador.nome}</TableCell>
                  <TableCell>
                    <Badge className={l.tipo === "credito" ? "bg-green-500" : "bg-red-500"}>
                      {l.tipo === "credito" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {l.tipo === "credito" ? "Crédito" : "Débito"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatHoras(l.horas, l.minutos)}</TableCell>
                  <TableCell>{formatDate(l.data)}</TableCell>
                  <TableCell>{l.motivo}</TableCell>
                  <TableCell className={l.saldoAtual >= 0 ? "text-green-600" : "text-red-600"}>{formatSaldo(l.saldoAtual)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(l.id)}><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(l.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
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

