import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ESocialCardProps {
  evento: string;
  status: 'pendente' | 'enviado' | 'erro' | 'processado';
  data?: string;
  descricao?: string;
}

export function ESocialCard({ evento, status, data, descricao }: ESocialCardProps) {
  const statusConfig = {
    pendente: { label: 'Pendente', variant: 'outline' as const },
    enviado: { label: 'Enviado', variant: 'secondary' as const },
    erro: { label: 'Erro', variant: 'destructive' as const },
    processado: { label: 'Processado', variant: 'default' as const },
  };

  const config = statusConfig[status];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{evento}</CardTitle>
        <Badge variant={config.variant}>{config.label}</Badge>
      </CardHeader>
      <CardContent>
        {descricao && <p className="text-sm text-muted-foreground">{descricao}</p>}
        {data && <p className="text-xs text-muted-foreground mt-1">{data}</p>}
      </CardContent>
    </Card>
  );
}

export default ESocialCard;
