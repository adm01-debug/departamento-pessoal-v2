/**
 * @fileoverview Visualização de assinatura digital
 * @module components/assinatura/AssinaturaPreview
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, FileSignature } from 'lucide-react';

interface AssinaturaPreviewProps {
  assinatura?: string;
  status?: 'pendente' | 'assinado' | 'recusado';
  dataAssinatura?: string;
  signatario?: string;
  className?: string;
}

const statusConfig = {
  pendente: { icon: Clock, label: 'Pendente', color: 'bg-yellow-500' },
  assinado: { icon: CheckCircle, label: 'Assinado', color: 'bg-green-500' },
  recusado: { icon: XCircle, label: 'Recusado', color: 'bg-red-500' },
};

/**
 * Preview de assinatura com status
 */
export const AssinaturaPreview = memo(function AssinaturaPreview({
  assinatura,
  status = 'pendente',
  dataAssinatura,
  signatario,
  className = ''
}: AssinaturaPreviewProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileSignature className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Assinatura Digital</span>
          </div>
          <Badge variant="outline" className="gap-1">
            <span className={`h-2 w-2 rounded-full ${config.color}`} />
            {config.label}
          </Badge>
        </div>
        {assinatura ? (
          <div className="border rounded-lg p-2 bg-white">
            <img src={assinatura} alt="Assinatura" className="max-h-20 mx-auto" />
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Icon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {status === 'pendente' ? 'Aguardando assinatura' : 'Assinatura não disponível'}
            </p>
          </div>
        )}
        {(signatario || dataAssinatura) && (
          <div className="mt-3 text-xs text-muted-foreground space-y-1">
            {signatario && <p>Signatário: {signatario}</p>}
            {dataAssinatura && <p>Data: {dataAssinatura}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
