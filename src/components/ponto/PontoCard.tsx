/**
 * @fileoverview Card de registro de ponto
 * @module components/ponto/PontoCard
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, LogIn, LogOut, Coffee, AlertTriangle } from 'lucide-react';

interface Registro { tipo: 'entrada' | 'saida' | 'intervalo_inicio' | 'intervalo_fim'; hora: string; }
interface PontoCardProps { colaborador: string; data: string; registros: Registro[]; horasTrabalhadas?: string; status: 'completo' | 'incompleto' | 'falta' | 'ferias' | 'folga'; }

const statusConfig = {
  completo: { label: 'Completo', variant: 'default' as const },
  incompleto: { label: 'Incompleto', variant: 'outline' as const },
  falta: { label: 'Falta', variant: 'destructive' as const },
  ferias: { label: 'Férias', variant: 'secondary' as const },
  folga: { label: 'Folga', variant: 'secondary' as const },
};

const tipoIcon = { entrada: LogIn, saida: LogOut, intervalo_inicio: Coffee, intervalo_fim: Coffee };

export const PontoCard = memo(function PontoCard({ colaborador, data, registros, horasTrabalhadas, status }: PontoCardProps) {
  const config = statusConfig[status];
  const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium">{colaborador}</h3>
            <p className="text-sm text-muted-foreground">{dataFormatada}</p>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
        {registros.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {registros.map((r, i) => { const Icon = tipoIcon[r.tipo]; return (
              <div key={i} className="flex flex-col items-center p-2 bg-muted rounded text-center">
                <Icon className="h-4 w-4 text-muted-foreground mb-1" />
                <span className="text-sm font-medium">{r.hora}</span>
              </div>
            ); })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-4 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mr-2" />Sem registros
          </div>
        )}
        {horasTrabalhadas && (
          <div className="flex items-center justify-end mt-3 text-sm">
            <Clock className="h-4 w-4 mr-1" /><span className="font-medium">{horasTrabalhadas}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
