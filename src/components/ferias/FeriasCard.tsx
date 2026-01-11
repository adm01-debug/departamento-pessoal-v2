// V15-254: src/components/ferias/FeriasCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { Calendar, Clock } from 'lucide-react';
import type { Ferias } from '@/types';

interface FeriasCardProps {
  ferias: Ferias;
}

export function FeriasCard({ ferias }: FeriasCardProps) {
  const percentGozado = (ferias.dias_gozados / ferias.dias_direito) * 100;
  const statusVariant = ferias.status === 'vigente' ? 'success' : ferias.status === 'vencida' ? 'error' : 'info';

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Período Aquisitivo</CardTitle>
          <StatusBadge status={ferias.status} variant={statusVariant as any} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>{ferias.periodo_aquisitivo_inicio} a {ferias.periodo_aquisitivo_fim}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Dias gozados</span>
            <span className="font-medium">{ferias.dias_gozados} / {ferias.dias_direito}</span>
          </div>
          <Progress value={percentGozado} className="h-2" />
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{ferias.dias_restantes} dias restantes</span>
          </div>
          {ferias.dias_vendidos > 0 && (
            <span className="text-green-600">{ferias.dias_vendidos} dias vendidos</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
