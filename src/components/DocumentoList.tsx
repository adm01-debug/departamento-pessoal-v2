// V14-038: DocumentoList.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Download, FileText } from "lucide-react";

interface Documento {
  id: string;
  tipo: string;
  titulo: string;
  dataEmissao?: string;
  dataValidade?: string;
  tamanho: string;
  url: string;
}

interface DocumentoListProps {
  documentos: Documento[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  isLoading?: boolean;
}

const tipoLabels: Record<string, string> = {
  contrato: "Contrato", aditivo: "Aditivo", atestado: "Atestado", certificado: "Certificado",
  declaracao: "Declaração", recibo: "Recibo", outro: "Outro",
};

export function DocumentoList({ documentos, onAdd, onEdit, onDelete, onView, onDownload, isLoading }: DocumentoListProps) {
  const [search, setSearch] = useState("");

  const filtered = documentos.filter((d) =>
    d.titulo.toLowerCase().includes(search.toLowerCase()) || tipoLabels[d.tipo]?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("pt-BR") : "-";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar documentos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {onAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />Novo Documento</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Emissão</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Nenhum documento encontrado</TableCell></TableRow>
            ) : (
              filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{d.titulo}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{tipoLabels[d.tipo]}</Badge></TableCell>
                  <TableCell>{formatDate(d.dataEmissao)}</TableCell>
                  <TableCell>{formatDate(d.dataValidade)}</TableCell>
                  <TableCell className="text-muted-foreground">{d.tamanho}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(d.id)}><Eye className="mr-2 h-4 w-4" />Visualizar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownload?.(d.id)}><Download className="mr-2 h-4 w-4" />Download</DropdownMenuItem>
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

