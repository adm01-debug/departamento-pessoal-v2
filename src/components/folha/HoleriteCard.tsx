/**
 * @fileoverview Card de holerite com resumo de proventos e descontos
 * @module components/folha/HoleriteCard
 */
import { memo } from 'react';
import { FileText, Download, Eye, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HoleriteCardProps {
  id: string;
  colaboradorNome: string;
  competencia: string;
  totalProventos: number;
  totalDescontos: number;
  totalLiquido: number;
  status: 'disponivel' | 'processando' | 'enviado';
  onVisualizar?: (id: string) => void;
  onDownload?: (id: string) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  disponivel: { label: 'Disponível', variant: 'default' },
  processando: { label: 'Processando', variant: 'outline' },
  enviado: { label: 'Enviado', variant: 'secondary' },
};

/**
 * Card de holerite do colaborador
 * @param props - Propriedades do holerite
 * @returns Elemento React
 */
export const HoleriteCard = memo(function HoleriteCard({
  id,
  colaboradorNome,
  competencia,
  totalProventos,
  totalDescontos,
  totalLiquido,
  status,
  onVisualizar,
  onDownload,
}: HoleriteCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">{colaboradorNome}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {competencia}
              </div>
            </div>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
            <p className="text-xs text-muted-foreground">Proventos</p>
            <p className="font-medium text-green-600 text-sm">{formatCurrency(totalProventos)}</p>
          </div>
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
            <p className="text-xs text-muted-foreground">Descontos</p>
            <p className="font-medium text-red-600 text-sm">{formatCurrency(totalDescontos)}</p>
          </div>
          <div className="p-2 rounded-lg bg-primary/10">
            <p className="text-xs text-muted-foreground">Líquido</p>
            <p className="font-medium text-primary text-sm">{formatCurrency(totalLiquido)}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {onVisualizar && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onVisualizar(id)}>
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
          )}
          {onDownload && status === 'disponivel' && (
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => onDownload(id)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
