/**
 * @fileoverview Calendário de férias dos colaboradores
 * @module components/dashboard/VacationCalendar
 */
import { memo, useMemo } from 'react';
import { Calendar, Umbrella } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VacationPeriod {
  id: string;
  colaborador: string;
  inicio: string;
  fim: string;
  status: 'aprovada' | 'pendente' | 'em_andamento';
}

interface VacationCalendarProps {
  /** Lista de períodos de férias */
  vacations: VacationPeriod[];
  /** Mês atual para exibição */
  currentMonth?: Date;
}

const statusConfig = {
  aprovada: { label: 'Aprovada', variant: 'default' as const },
  pendente: { label: 'Pendente', variant: 'secondary' as const },
  em_andamento: { label: 'Em Andamento', variant: 'outline' as const },
};

/**
 * Calendário visual de férias agendadas
 */
export const VacationCalendar = memo(function VacationCalendar({ vacations, currentMonth = new Date() }: VacationCalendarProps) {
  const sortedVacations = useMemo(() => {
    return [...vacations].sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());
  }, [vacations]);

  const mesAtual = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Umbrella className="h-4 w-4 text-cyan-500" />
          Férias - {mesAtual}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
        {sortedVacations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma férias programada este mês
          </p>
        ) : (
          sortedVacations.map((vacation) => {
            const config = statusConfig[vacation.status];
            return (
              <div key={vacation.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{vacation.colaborador}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {vacation.inicio} - {vacation.fim}
                    </div>
                  </div>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
});

