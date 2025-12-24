/**
 * @fileoverview Card de saldo de férias
 * @module components/ferias/SaldoFeriasCard
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Palmtree, AlertTriangle, Clock } from 'lucide-react';

interface SaldoFeriasCardProps {
  colaborador: string;
  periodoAquisitivo: { inicio: string; fim: string };
  diasAdquiridos: number;
  diasGozados: number;
  diasPendentes: number;
  vencimento?: string;
}

export const SaldoFeriasCard = memo(function SaldoFeriasCard({
  colaborador, periodoAquisitivo, diasAdquiridos, diasGozados, diasPendentes, vencimento
}: SaldoFeriasCardProps) {
  const percentualGozado = diasAdquiridos > 0 ? (diasGozados / diasAdquiridos) * 100 : 0;
  const isVencendo = vencimento && new Date(vencimento) <= new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

  const formatDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');

  return (
    <Card className={isVencendo ? 'border-yellow-500' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Palmtree className="h-4 w-4" />
            Saldo de Férias
          </CardTitle>
          {isVencendo && <Badge variant="outline" className="text-yellow-600"><AlertTriangle className="h-3 w-3 mr-1" />Vencendo</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{colaborador}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <Clock className="h-3 w-3 inline mr-1" />
          Período: {formatDate(periodoAquisitivo.inicio)} a {formatDate(periodoAquisitivo.fim)}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span>{diasGozados}/{diasAdquiridos} dias</span>
          </div>
          <Progress value={percentualGozado} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted rounded">
            <p className="text-lg font-bold text-primary">{diasAdquiridos}</p>
            <p className="text-xs text-muted-foreground">Adquiridos</p>
          </div>
          <div className="p-2 bg-muted rounded">
            <p className="text-lg font-bold text-green-600">{diasGozados}</p>
            <p className="text-xs text-muted-foreground">Gozados</p>
          </div>
          <div className="p-2 bg-muted rounded">
            <p className="text-lg font-bold text-orange-600">{diasPendentes}</p>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </div>
        </div>
        {vencimento && (
          <p className="text-xs text-muted-foreground text-center">Vencimento: {formatDate(vencimento)}</p>
        )}
      </CardContent>
    </Card>
  );
});
