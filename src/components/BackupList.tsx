// V14-025: BackupList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Download, Trash2, Play, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Backup {
  id: string;
  nome: string;
  tipo: string;
  destino: string;
  tamanho: string;
  status: "concluido" | "em_progresso" | "erro" | "agendado";
  progresso?: number;
  dataHora: string;
}

interface BackupListProps {
  backups: Backup[];
  onAdd: () => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onExecute: (id: string) => void;
}

const statusConfig = {
  concluido: { color: "bg-green-500", label: "Concluído" },
  em_progresso: { color: "bg-blue-500", label: "Em Progresso" },
  erro: { color: "bg-red-500", label: "Erro" },
  agendado: { color: "bg-yellow-500", label: "Agendado" },
};

export function BackupList({ backups, onAdd, onDownload, onDelete, onRestore, onExecute }: BackupListProps) {
  const [search, setSearch] = useState("");

  const filtered = backups.filter((b) => b.nome.toLowerCase().includes(search.toLowerCase()));

  const formatDateTime = (date: string) => new Date(date).toLocaleString("pt-BR");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Backups</CardTitle>
        <Button onClick={onAdd}><Plus className="h-4 w-4 mr-2" />Novo Backup</Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar backups..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum backup encontrado</TableCell></TableRow>
            ) : (
              filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.nome}</TableCell>
                  <TableCell>{b.tipo}</TableCell>
                  <TableCell>{b.destino}</TableCell>
                  <TableCell>{b.tamanho}</TableCell>
                  <TableCell>
                    {b.status === "em_progresso" && b.progresso !== undefined ? (
                      <div className="w-24"><Progress value={b.progresso} className="h-2" /></div>
                    ) : (
                      <Badge className={statusConfig[b.status].color}>{statusConfig[b.status].label}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{formatDateTime(b.dataHora)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onExecute(b.id)}><Play className="h-4 w-4 mr-2" />Executar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownload(b.id)}><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRestore(b.id)}><RefreshCw className="h-4 w-4 mr-2" />Restaurar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(b.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
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

