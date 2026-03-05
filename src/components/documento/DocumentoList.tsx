// @ts-nocheck
// V15-277: src/components/documento/DocumentoList.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Trash2, FileText, Image, File } from 'lucide-react';
import { format } from 'date-fns';
import type { Documento } from '@/types';

interface DocumentoListProps {
  documentos: Documento[];
  onView?: (doc: Documento) => void;
  onDownload?: (doc: Documento) => void;
  onDelete?: (doc: Documento) => void;
}

const getIcon = (tipo: string) => {
  if (tipo.startsWith('image/')) return Image;
  if (tipo === 'application/pdf') return FileText;
  return File;
};

export function DocumentoList({ documentos, onView, onDownload, onDelete }: DocumentoListProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Tamanho</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="w-[120px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documentos.map((doc) => {
          const Icon = getIcon(doc.arquivo_tipo);
          return (
            <TableRow key={doc.id}>
              <TableCell className="flex items-center gap-2"><Icon className="h-4 w-4" />{doc.nome}</TableCell>
              <TableCell><Badge variant="outline">{doc.tipo}</Badge></TableCell>
              <TableCell>{formatSize(doc.arquivo_tamanho)}</TableCell>
              <TableCell>{format(new Date(doc.created_at), 'dd/MM/yyyy')}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {onView && <Button variant="ghost" size="icon" onClick={() => onView(doc)}><Eye className="h-4 w-4" /></Button>}
                  {onDownload && <Button variant="ghost" size="icon" onClick={() => onDownload(doc)}><Download className="h-4 w-4" /></Button>}
                  {onDelete && <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(doc)}><Trash2 className="h-4 w-4" /></Button>}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
