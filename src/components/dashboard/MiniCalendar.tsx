import { memo } from 'react';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  data: string;
  tipo: 'ferias' | 'admissao' | 'feriado' | 'pagamento' | 'afastamento';
  titulo: string;
}

interface MiniCalendarProps {
  eventos: CalendarEvent[];
  mes?: number;
  ano?: number;
}

const eventColors: Record<string, string> = {
  ferias: 'bg-warning',
  admissao: 'bg-success',
  feriado: 'bg-info',
  pagamento: 'bg-primary',
  afastamento: 'bg-loggi',
};

const eventEmojis: Record<string, string> = {
  ferias: '🏖️',
  admissao: '📥',
  feriado: '🔵',
  pagamento: '💰',
  afastamento: '🏥',
};

export function MiniCalendar({ eventos, mes = 11, ano = 2025 }: MiniCalendarProps) {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  
  const dias: (number | null)[] = [];
  for (let i = 0; i < primeiroDia; i++) dias.push(null);
  for (let i = 1; i <= ultimoDia; i++) dias.push(i);

  const getEventosData = (dia: number) => {
    const dataStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return eventos.filter(e => e.data === dataStr);
  };

  const nomeMes = new Date(ano, mes).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground capitalize">{nomeMes}</h4>
      
      {/* Header */}
      <div className="grid grid-cols-7 gap-1">
        {diasSemana.map(dia => (
          <div key={dia} className="text-center text-xs text-muted-foreground font-medium py-1">
            {dia}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {dias.map((dia, index) => {
          if (dia === null) {
            return <div key={`empty-${index}`} className="h-8" />;
          }
          const eventosHoje = getEventosData(dia);
          const hoje = new Date().getDate() === dia && new Date().getMonth() === mes;
          
          return (
            <div 
              key={dia} 
              className={cn(
                "h-8 flex flex-col items-center justify-center rounded text-xs relative cursor-pointer hover:bg-muted/50 transition-colors",
                hoje && "bg-primary/20 font-bold text-primary"
              )}
              title={eventosHoje.map(e => e.titulo).join(', ')}
            >
              <span>{dia}</span>
              {eventosHoje.length > 0 && (
                <div className="absolute -bottom-0.5 flex gap-0.5">
                  {eventosHoje.slice(0, 2).map((ev, i) => (
                    <div key={i} className={cn("w-1 h-1 rounded-full", eventColors[ev.tipo])} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
        {Object.entries(eventEmojis).map(([tipo, emoji]) => (
          <span key={tipo} className="text-xs text-muted-foreground flex items-center gap-1">
            <span>{emoji}</span>
            <span className="capitalize">{tipo}</span>
          </span>
        ))}
      </div>
    </div>
  );
}



