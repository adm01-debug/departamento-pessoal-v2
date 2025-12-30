import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DesligamentoCardProps {
  colaborador: string;
  dataDesligamento: string;
  tipo: string;
  status: string;
}

export function DesligamentoCard({ colaborador, dataDesligamento, tipo, status }: DesligamentoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{colaborador}</CardTitle>
        <Badge variant={status === 'concluido' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {format(new Date(dataDesligamento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Tipo: {tipo}</p>
      </CardContent>
    </Card>
  );
}
