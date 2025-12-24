/**
 * @fileoverview Lista de documentos
 * @module components/documentos/DocumentoList
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Trash2, Clock, CheckCircle, AlertTriangle, File, FileImage, FileSpreadsheet } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  dataUpload: Date;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  categoria?: string;
}

interface DocumentoListProps {
  documentos: Documento[];
  loading?: boolean;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  pendente: { icon: Clock, color: 'text-yellow-500', label: 'Pendente' },
  aprovado: { icon: CheckCircle, color: 'text-green-500', label: 'Aprovado' },
  rejeitado: { icon: AlertTriangle, color: 'text-red-500', label: 'Rejeitado' },
};

const getFileIcon = (tipo: string) => {
  if (tipo.includes('image')) return FileImage;
  if (tipo.includes('sheet') || tipo.includes('excel')) return FileSpreadsheet;
  if (tipo.includes('pdf')) return FileText;
  return File;
};

/**
 * Lista de documentos com ações
 */
export const DocumentoList = memo(function DocumentoList({
  documentos, loading, onView, onDownload, onDelete
}: DocumentoListProps) {
  if (loading) {
    return <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}</div>;
  }

  if (documentos.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg">
        <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Nenhum documento</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documentos.map(doc => {
        const Icon = getFileIcon(doc.tipo);
        const status = statusConfig[doc.status];
        const StatusIcon = status.icon;
        return (
          <Card key={doc.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-muted rounded"><Icon className="h-5 w-5 text-muted-foreground" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{doc.nome}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{doc.tamanho}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(doc.dataUpload, { addSuffix: true, locale: ptBR })}</span>
                </div>
              </div>
              <StatusIcon className={`h-4 w-4 ${status.color}`} />
              <div className="flex gap-1">
                {onView && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(doc.id)}><Eye className="h-4 w-4" /></Button>}
                {onDownload && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDownload(doc.id)}><Download className="h-4 w-4" /></Button>}
                {onDelete && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(doc.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});
