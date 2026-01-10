// V14-023: AuditoriaList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, Eye, Filter } from "lucide-react";

interface LogAuditoria {
  id: string;
  usuario: { id: string; nome: string; email: string };
  tipo: string;
  modulo: string;
  acao: string;
  detalhes: string;
  ip: string;
  dataHora: string;
}

interface AuditoriaListProps {
  logs: LogAuditoria[];
  onExport: () => void;
  onViewDetails: (id: string) => void;
  onFilter: () => void;
}

const tipoColors: Record<string, string> = {
  acesso: "bg-blue-500",
  alteracao: "bg-yellow-500",
  exclusao: "bg-red-500",
  exportacao: "bg-purple-500",
  importacao: "bg-green-500",
};

export function AuditoriaList({ logs, onExport, onViewDetails, onFilter }: AuditoriaListProps) {
  const [search, setSearch] = useState("");

  const filtered = logs.filter((l) =>
    l.usuario.nome.toLowerCase().includes(search.toLowerCase()) ||
    l.acao.toLowerCase().includes(search.toLowerCase()) ||
    l.modulo.toLowerCase().includes(search.toLowerCase())
  );

  const formatDateTime = (date: string) => new Date(date).toLocaleString("pt-BR");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Logs de Auditoria</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onFilter}><Filter className="h-4 w-4 mr-2" />Filtros</Button>
          <Button variant="outline" onClick={onExport}><Download className="h-4 w-4 mr-2" />Exportar</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>IP</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum log encontrado</TableCell></TableRow>
            ) : (
              filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-sm">{formatDateTime(l.dataHora)}</TableCell>
                  <TableCell className="font-medium">{l.usuario.nome}</TableCell>
                  <TableCell><Badge className={tipoColors[l.tipo] || "bg-gray-500"}>{l.tipo}</Badge></TableCell>
                  <TableCell>{l.modulo}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{l.acao}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.ip}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onViewDetails(l.id)}><Eye className="h-4 w-4" /></Button>
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

