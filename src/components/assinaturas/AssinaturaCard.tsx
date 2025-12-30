import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSignature } from 'lucide-react';

interface AssinaturaCardProps {
  id?: string;
  titulo?: string;
  status?: 'pendente' | 'assinado' | 'expirado';
  dataAssinatura?: string;
  className?: string;
}

const statusConfig = {
  pendente: { label: 'Pendente', variant: 'secondary' as const },
  assinado: { label: 'Assinado', variant: 'default' as const },
  expirado: { label: 'Expirado', variant: 'destructive' as const },
};

export const AssinaturaCard = memo(function AssinaturaCard({
  id,
  titulo = 'Documento',
  status = 'pendente',
  dataAssinatura,
  className
}: AssinaturaCardProps) {
  const config = statusConfig[status];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-4">
        <FileSignature className="h-8 w-8 text-primary" />
        <div className="flex-1">
          <CardTitle className="text-lg">{titulo}</CardTitle>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {dataAssinatura && (
          <p className="text-sm text-muted-foreground">
            Assinado em: {new Date(dataAssinatura).toLocaleDateString('pt-BR')}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

export default AssinaturaCard;
