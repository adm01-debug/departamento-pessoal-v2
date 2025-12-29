/**
 * @fileoverview Mini calendário para dashboard com eventos
 * @module components/dashboard/MiniCalendar
 * @version V8.2 - Interface compatível com Dashboard
 */
import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Interface de evento do calendário
 * Compatível com Date object do Dashboard
 */
interface EventoCalendario {
  id: string;
  titulo: string;
  data: Date | string;
  tipo: 'ferias' | 'admissao' | 'desligamento' | 'aniversario' | 'feriado' | 'pagamento' | 'afastamento';
}

interface MiniCalendarProps {
  eventos: EventoCalendario[];
  mes?: number;
  ano?: number;
}

const eventColors: Record<string, string> = {
  ferias: 'bg-warning',
  admissao: 'bg-success',
  desligamento: 'bg-destructive',
  aniversario: 'bg-pink-500',
  feriado: 'bg-info',
  pagamento: 'bg-primary',
  afastamento: 'bg-loggi',
};

const eventEmojis: Record<string, string> = {
  ferias: '🏖️',
  admissao: '✨',
  desligamento: '👋',
  aniversario: '🎂',
  feriado: '🔵',
  pagamento: '💰',
  afastamento: '🏥',
};

export const MiniCalendar = memo(function MiniCalendar({ 
  eventos, 
  mes = new Date().getMonth(), 
  ano = new Date().getFullYear() 
}: MiniCalendarProps) {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Calcular dias do mês
  const diasDoMes = useMemo(() => {
    const inicio = startOfMonth(new Date(ano, mes));
    const fim = endOfMonth(new Date(ano, mes));
    return eachDayOfInterval({ start: inicio, end: fim });
  }, [ano, mes]);

  const primeiroDiaSemana = getDay(new Date(ano, mes, 1));
  
  // Criar array com espaços vazios no início
  const dias: (Date | null)[] = useMemo(() => {
    const resultado: (Date | null)[] = [];
    for (let i = 0; i < primeiroDiaSemana; i++) {
      resultado.push(null);
    }
    return [...resultado, ...diasDoMes];
  }, [diasDoMes, primeiroDiaSemana]);

  // Normalizar data do evento para Date
  const normalizeDate = (data: Date | string): Date => {
    if (data instanceof Date) return data;
    return new Date(data);
  };

  // Buscar eventos para uma data específica
  const getEventosData = (dia: Date): EventoCalendario[] => {
    return eventos.filter(e => {
      const eventDate = normalizeDate(e.data);
      return isSameDay(eventDate, dia);
    });
  };

  const nomeMes = format(new Date(ano, mes), 'MMMM yyyy', { locale: ptBR });
  const hoje = new Date();

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground capitalize">{nomeMes}</h4>
      
      {/* Header dos dias da semana */}
      <div className="grid grid-cols-7 gap-1">
        {diasSemana.map(dia => (
          <div 
            key={dia} 
            className="text-center text-xs text-muted-foreground font-medium py-1"
            aria-hidden="true"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Dias do mês */}
      <div 
        role="grid" 
        aria-label={`Calendário de ${nomeMes}`} 
        className="grid grid-cols-7 gap-1"
      >
        {dias.map((dia, index) => {
          if (dia === null) {
            return <div key={`empty-${index}`} className="h-8" aria-hidden="true" />;
          }
          
          const eventosHoje = getEventosData(dia);
          const isHoje = isSameDay(dia, hoje);
          const diaNumero = dia.getDate();
          
          return (
            <div 
              key={diaNumero}
              role="gridcell"
              aria-label={`${diaNumero} de ${nomeMes}${eventosHoje.length > 0 ? `, ${eventosHoje.length} evento(s)` : ''}`}
              className={cn(
                "h-8 flex flex-col items-center justify-center rounded text-xs relative cursor-pointer hover:bg-muted/50 transition-colors",
                isHoje && "bg-primary/20 font-bold text-primary ring-1 ring-primary/30"
              )}
              title={eventosHoje.map(e => e.titulo).join(', ')}
            >
              <span>{diaNumero}</span>
              {eventosHoje.length > 0 && (
                <div className="absolute bottom-0.5 flex gap-0.5">
                  {eventosHoje.slice(0, 3).map((evento, i) => (
                    <span 
                      key={i} 
                      className={cn(
                        "w-1 h-1 rounded-full",
                        eventColors[evento.tipo] || 'bg-muted-foreground'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legenda de eventos do mês */}
      {eventos.length > 0 && (
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Próximos eventos:</p>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {eventos
              .filter(e => {
                const eventDate = normalizeDate(e.data);
                return eventDate.getMonth() === mes && eventDate.getFullYear() === ano;
              })
              .sort((a, b) => normalizeDate(a.data).getTime() - normalizeDate(b.data).getTime())
              .slice(0, 5)
              .map(evento => (
                <div key={evento.id} className="flex items-center gap-2 text-xs">
                  <span>{eventEmojis[evento.tipo] || '📌'}</span>
                  <span className="text-muted-foreground">
                    {format(normalizeDate(evento.data), 'dd')}
                  </span>
                  <span className="truncate">{evento.titulo}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
});

export type { EventoCalendario };
