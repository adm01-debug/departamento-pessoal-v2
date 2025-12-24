/**
 * @fileoverview Card de férias com período e status
 * @module components/ferias/FeriasCard
 */
import { memo } from 'react';
import { Calendar, User, Clock, Sun, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type StatusFerias = 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';

interface FeriasCardProps {
  id: string;
  colaboradorNome: string;
  dataInicio: string;
  dataFim: string;
  diasTotais: number;
  diasUsufruidos?: number;
  status: StatusFerias;
  periodoAquisitivo?: string;
  abonoPecuniario?: boolean;
  onVerDetalhes?: (id: string) => void;
  onGerarAviso?: (id: string) => void;
}

const statusConfig: Record<StatusFerias, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  agendada: { label: 'Agendada', variant: 'outline' },
  em_andamento: { label: 'Em Andamento', variant: 'default' },
  concluida: { label: 'Concluída', variant: 'secondary' },
  cancelada: { label: 'Cancelada', variant: 'destructive' },
};

/**
 * Card de férias do colaborador
 * @param props - Propriedades das férias
 * @returns Elemento React
 */
export const FeriasCard = memo(function FeriasCard({
  id,
  colaboradorNome,
  dataInicio,
  dataFim,
  diasTotais,
  diasUsufruidos = 0,
  status,
  periodoAquisitivo,
  abonoPecuniario = false,
  onVerDetalhes,
  onGerarAviso,
}: FeriasCardProps) {
  const statusInfo = statusConfig[status];
  const progressPercent = (diasUsufruidos / diasTotais) * 100;

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-base">Férias</CardTitle>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{colaboradorNome}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Início: {dataInicio}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Fim: {dataFim}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span>{diasUsufruidos}/{diasTotais} dias</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {periodoAquisitivo && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Período Aquisitivo: {periodoAquisitivo}</span>
          </div>
        )}

        {abonoPecuniario && (
          <Badge variant="outline" className="text-xs">
            Abono Pecuniário
          </Badge>
        )}

        <div className="flex gap-2 pt-2">
          {onVerDetalhes && (
            <Button variant="outline" size="sm" onClick={() => onVerDetalhes(id)}>
              Ver Detalhes
            </Button>
          )}
          {onGerarAviso && status === 'agendada' && (
            <Button variant="ghost" size="sm" onClick={() => onGerarAviso(id)}>
              <FileText className="h-4 w-4 mr-2" />
              Gerar Aviso
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
