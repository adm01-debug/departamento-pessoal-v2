import { useState, memo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Admissao {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  data_prevista: string;
  etapa: string;
}

interface CalendarioAdmissoesProps {
  admissoes: Admissao[];
  etapaLabels: Record<string, string>;
  onSelectAdmissao: (admissao: Admissao) => void;
}

export function CalendarioAdmissoes({ admissoes, etapaLabels, onSelectAdmissao }: CalendarioAdmissoesProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Preencher dias da semana anterior ao início do mês
  const startDayOfWeek = monthStart.getDay();
  const prevMonthEnd = endOfMonth(subMonths(currentMonth, 1));
  const prevMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => {
    const day = new Date(prevMonthEnd);
    day.setDate(prevMonthEnd.getDate() - (startDayOfWeek - 1 - i));
    return day;
  });

  // Preencher dias do próximo mês até completar 6 semanas
  const endDayOfWeek = monthEnd.getDay();
  const nextMonthDays = Array.from({ length: 6 - endDayOfWeek }, (_, i) => {
    const day = new Date(monthEnd);
    day.setDate(monthEnd.getDate() + i + 1);
    return day;
  });

  const allDays = [...prevMonthDays, ...days, ...nextMonthDays];

  const getAdmissoesDia = (date: Date) => {
    return admissoes.filter(adm => isSameDay(new Date(adm.data_prevista), date));
  };

  const etapaColors: Record<string, string> = {
    'solicitacao': 'bg-info text-info-foreground',
    'coleta_documentos': 'bg-warning text-warning-foreground',
    'validacao': 'bg-primary text-primary-foreground',
    'exame_admissional': 'bg-success text-success-foreground',
    'contrato': 'bg-loggi text-white',
    'assinatura': 'bg-info text-info-foreground',
    'esocial': 'bg-primary text-primary-foreground',
  };

  return (
    <div className="rounded-lg border bg-card">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="outline" size="icon" aria-label="Mês anterior" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <Button variant="outline" size="icon" aria-label="Mês anterior" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 border-b">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
          <div key={dia} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {dia}
          </div>
        ))}
      </div>

      {/* Dias do Mês */}
      <div className="grid grid-cols-7">
        {allDays.map((day, idx) => {
          const admissoesDia = getAdmissoesDia(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={idx}
              className={cn(
                "min-h-[100px] p-2 border-b border-r last:border-r-0 transition-colors",
                !isCurrentMonth && "bg-muted/30",
                isToday && "bg-primary/5"
              )}
            >
              <div className={cn(
                "text-sm font-medium mb-1",
                !isCurrentMonth && "text-muted-foreground",
                isToday && "text-primary"
              )}>
                {format(day, 'd')}
              </div>

              <div className="space-y-1">
                {admissoesDia.slice(0, 2).map((adm) => (
                  <TooltipProvider key={adm.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() => onSelectAdmissao(adm)}
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded cursor-pointer truncate flex items-center gap-1",
                            etapaColors[adm.etapa] || "bg-muted"
                          )}
                        >
                          <User className="w-3 h-3 shrink-0" />
                          <span className="truncate">{adm.nome.split(' ')[0]}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div className="space-y-1">
                          <p className="font-medium">{adm.nome}</p>
                          <p className="text-xs text-muted-foreground">{adm.cargo}</p>
                          <Badge variant="outline" className="text-xs">
                            {etapaLabels[adm.etapa] || adm.etapa}
                          </Badge>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {admissoesDia.length > 2 && (
                  <div className="text-xs text-muted-foreground pl-1">
                    +{admissoesDia.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="p-4 border-t">
        <p className="text-sm font-medium mb-2">Legenda:</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(etapaLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded-sm", etapaColors[key] || "bg-muted")} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




