/**
 * @fileoverview Card de documento com preview e ações
 * @module components/documentos/DocumentoCard
 */
import { memo } from 'react';
import { FileText, Download, Eye, Trash2, Calendar, User, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type TipoDocumento = 'contrato' | 'atestado' | 'declaracao' | 'comprovante' | 'certidao' | 'outros';
type StatusDocumento = 'ativo' | 'vencido' | 'pendente';

interface DocumentoCardProps {
  id: string;
  nome: string;
  tipo: TipoDocumento;
  colaboradorNome?: string;
  dataUpload: string;
  dataValidade?: string;
  tamanho?: string;
  status: StatusDocumento;
  onVisualizar?: (id: string) => void;
  onDownload?: (id: string) => void;
  onExcluir?: (id: string) => void;
}

const tipoLabels: Record<TipoDocumento, string> = {
  contrato: 'Contrato',
  atestado: 'Atestado',
  declaracao: 'Declaração',
  comprovante: 'Comprovante',
  certidao: 'Certidão',
  outros: 'Outros',
};

const statusConfig: Record<StatusDocumento, { label: string; variant: 'default' | 'destructive' | 'outline' }> = {
  ativo: { label: 'Ativo', variant: 'default' },
  vencido: { label: 'Vencido', variant: 'destructive' },
  pendente: { label: 'Pendente', variant: 'outline' },
};

/**
 * Card de documento com ações
 * @param props - Propriedades do documento
 * @returns Elemento React
 */
export const DocumentoCard = memo(function DocumentoCard({
  id,
  nome,
  tipo,
  colaboradorNome,
  dataUpload,
  dataValidade,
  tamanho,
  status,
  onVisualizar,
  onDownload,
  onExcluir,
}: DocumentoCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover:border-primary/30 transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium truncate">{nome}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{tipoLabels[tipo]}</Badge>
                  <Badge variant={statusInfo.variant} className="text-xs">{statusInfo.label}</Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onVisualizar && (
                    <DropdownMenuItem onClick={() => onVisualizar(id)}>
                      <Eye className="h-4 w-4 mr-2" />Visualizar
                    </DropdownMenuItem>
                  )}
                  {onDownload && (
                    <DropdownMenuItem onClick={() => onDownload(id)}>
                      <Download className="h-4 w-4 mr-2" />Download
                    </DropdownMenuItem>
                  )}
                  {onExcluir && (
                    <DropdownMenuItem onClick={() => onExcluir(id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />Excluir
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              {colaboradorNome && (
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />{colaboradorNome}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />Upload: {dataUpload}
              </div>
              {dataValidade && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />Validade: {dataValidade}
                </div>
              )}
              {tamanho && <span>{tamanho}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
