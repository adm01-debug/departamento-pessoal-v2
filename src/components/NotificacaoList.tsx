// V14-048: NotificacaoList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Eye, Trash2, Bell, BellOff, Check } from "lucide-react";

interface Notificacao {
  id: string;
  tipo: "info" | "alerta" | "erro" | "sucesso";
  titulo: string;
  mensagem: string;
  destinatarios: string;
  dataEnvio: string;
  lida: boolean;
}

interface NotificacaoListProps {
  notificacoes: Notificacao[];
  onAdd?: () => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  isLoading?: boolean;
}

const tipoConfig = {
  info: { label: "Info", variant: "secondary" as const },
  alerta: { label: "Alerta", variant: "outline" as const },
  erro: { label: "Erro", variant: "destructive" as const },
  sucesso: { label: "Sucesso", variant: "default" as const },
};

export function NotificacaoList({ notificacoes, onAdd, onView, onDelete, onMarkRead, isLoading }: NotificacaoListProps) {
  const [search, setSearch] = useState("");

  const filtered = notificacoes.filter((n) =>
    n.titulo.toLowerCase().includes(search.toLowerCase()) || n.mensagem.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar notificações..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Nova Notificação</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Destinatários</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Nenhuma notificação encontrada</TableCell></TableRow>
            ) : (
              filtered.map((n) => (
                <TableRow key={n.id} className={!n.lida ? "bg-primary/5" : ""}>
                  <TableCell>{n.lida ? <BellOff className="h-4 w-4 text-muted-foreground" /> : <Bell className="h-4 w-4 text-primary" />}</TableCell>
                  <TableCell><Badge variant={tipoConfig[n.tipo].variant}>{tipoConfig[n.tipo].label}</Badge></TableCell>
                  <TableCell className="font-medium">{n.titulo}</TableCell>
                  <TableCell>{n.destinatarios}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(n.dataEnvio)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(n.id)}><Eye className="mr-2 h-4 w-4" />Ver</DropdownMenuItem>
                        {!n.lida && <DropdownMenuItem onClick={() => onMarkRead?.(n.id)}><Check className="mr-2 h-4 w-4" />Marcar lida</DropdownMenuItem>}
                        <DropdownMenuItem onClick={() => onDelete?.(n.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
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

