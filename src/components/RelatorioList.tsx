// V14-053: RelatorioList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Download, Trash2, Eye, FileText, FileSpreadsheet, File } from "lucide-react";

interface Relatorio {
  id: string;
  nome: string;
  tipo: string;
  formato: "pdf" | "excel" | "csv";
  periodo: string;
  geradoEm: string;
  tamanho: string;
  url: string;
}

interface RelatorioListProps {
  relatorios: Relatorio[];
  onAdd?: () => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  isLoading?: boolean;
}

const formatoIcons = { pdf: FileText, excel: FileSpreadsheet, csv: File };

export function RelatorioList({ relatorios, onAdd, onView, onDelete, onDownload, isLoading }: RelatorioListProps) {
  const [search, setSearch] = useState("");

  const filtered = relatorios.filter((r) =>
    r.nome.toLowerCase().includes(search.toLowerCase()) || r.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar relatórios..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Novo Relatório</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Relatório</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Gerado em</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Nenhum relatório encontrado</TableCell></TableRow>
            ) : (
              filtered.map((r) => {
                const Icon = formatoIcons[r.formato];
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{r.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>{r.tipo}</TableCell>
                    <TableCell>{r.periodo}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(r.geradoEm)}</TableCell>
                    <TableCell><Badge variant="outline">{r.formato.toUpperCase()}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{r.tamanho}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView?.(r.id)}><Eye className="mr-2 h-4 w-4" />Visualizar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDownload?.(r.id)}><Download className="mr-2 h-4 w-4" />Download</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete?.(r.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

