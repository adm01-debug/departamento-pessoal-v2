import { useState, memo, useMemo } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, 
  isSameMonth, isSameDay, isToday, addMonths, subMonths,
  isWithinInterval, parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FeriasComColaborador, StatusFerias } from '@/types/ferias';

interface CalendarioFeriasProps {
  ferias: FeriasComColaborador[];
  onDiaClick?: (data: Date) => void;
  onFeriasClick?: (ferias: FeriasComColaborador) => void;
}

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const statusCores: Record<StatusFerias, { bg: string; text: string; border: string }> = {
  programada: { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/50' },
  aprovada: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/50' },
  em_gozo: { bg: 'bg-info/20', text: 'text-info', border: 'border-info/50' },
  concluida: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' },
  cancelada: { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/50' },
  rejeitada: { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/50' },
  solicitada: { bg: 'bg-amber/20', text: 'text-amber-600', border: 'border-amber/50' },
};

export const CalendarioFerias = memo(function CalendarioFerias({ ferias, onDiaClick, onFeriasClick }: CalendarioFeriasProps) {
  const [mesAtual, setMesAtual] = useState(new Date());

  // Dias do mês
  const diasDoMes = useMemo(() => {
    const inicio = startOfMonth(mesAtual);
    const fim = endOfMonth(mesAtual);
    return eachDayOfInterval({ start: inicio, end: fim });
  }, [mesAtual]);

  // Dias vazios no início (para alinhar com dia da semana)
  const diasVaziosInicio = useMemo(() => {
    return getDay(startOfMonth(mesAtual));
  }, [mesAtual]);

  // Mapear férias por data
  const feriasPorData = useMemo(() => {
    const mapa = new Map<string, FeriasComColaborador[]>();
    
    ferias.forEach(f => {
      if (f.status === 'cancelada') return;
      
      const inicio = parseISO(f.data_inicio);
      const fim = parseISO(f.data_fim);
      
      // Percorrer todos os dias das férias
      const dias = eachDayOfInterval({ start: inicio, end: fim });
      dias.forEach(dia => {
        if (isSameMonth(dia, mesAtual)) {
          const key = format(dia, 'yyyy-MM-dd');
          const lista = mapa.get(key) ?? [];
          lista.push(f);
          mapa.set(key, lista);
        }
      });
    });
    
    return mapa;
  }, [ferias, mesAtual]);

  // Navegação
  const mesAnterior = () => setMesAtual(subMonths(mesAtual, 1));
  const mesProximo = () => setMesAtual(addMonths(mesAtual, 1));

  // Renderizar célula do dia
  const renderDia = (dia: Date) => {
    const dataStr = format(dia, 'yyyy-MM-dd');
    const feriasNoDia = feriasPorData.get(dataStr) ?? [];
    const ehHoje = isToday(dia);
    const ehFimDeSemana = getDay(dia) === 0 || getDay(dia) === 6;

    return (
      <div
        key={dataStr}
        onClick={() => onDiaClick?.(dia)}
        className={cn(
          "min-h-[80px] p-1 border border-border cursor-pointer transition-colors",
          "hover:bg-muted/50",
          ehHoje && "bg-primary/5 border-primary",
          ehFimDeSemana && "bg-muted/30"
        )}
      >
        <div className={cn(
          "text-xs font-medium mb-1",
          ehHoje && "text-primary",
          ehFimDeSemana && "text-muted-foreground"
        )}>
          {format(dia, 'd')}
        </div>
        
        <div className="space-y-0.5">
          {feriasNoDia.slice(0, 3).map((f, idx) => {
            const cores = statusCores[f.status];
            const ehInicio = isSameDay(parseISO(f.data_inicio), dia);
            const ehFim = isSameDay(parseISO(f.data_fim), dia);
            
            return (
              <TooltipProvider key={`${f.id}-${idx}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onFeriasClick?.(f);
                      }}
                      className={cn(
                        "text-[10px] px-1 py-0.5 truncate cursor-pointer",
                        cores.bg, cores.text,
                        ehInicio && "rounded-l",
                        ehFim && "rounded-r",
                        !ehInicio && !ehFim && "rounded-none"
                      )}
                    >
                    {ehInicio && (
                        <span className="flex items-center gap-0.5">
                          <User className="w-2 h-2" />
                          {f.colaborador?.nome?.split(' ')[0] || 'N/A'}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-medium">{f.colaborador?.nome || 'N/A'}</p>
                      <p>{format(parseISO(f.data_inicio), 'dd/MM')} - {format(parseISO(f.data_fim), 'dd/MM')}</p>
                      <p>{f.dias} dias</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          
          {feriasNoDia.length > 3 && (
            <div className="text-[10px] text-muted-foreground text-center">
              +{feriasNoDia.length - 3} mais
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <Button variant="ghost" size="icon" onClick={mesAnterior}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold capitalize">
          {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <Button variant="ghost" size="icon" onClick={mesProximo}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/50">
        {diasSemana.map((dia) => (
          <div
            key={dia}
            className="p-2 text-center text-xs font-semibold text-muted-foreground"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7">
        {/* Dias vazios no início */}
        {Array.from({ length: diasVaziosInicio }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[80px] bg-muted/20 border border-border" />
        ))}
        
        {/* Dias do mês */}
        {diasDoMes.map(renderDia)}
      </div>

      {/* Legenda */}
      <div className="p-3 border-t border-border bg-muted/30 flex flex-wrap gap-3">
        {Object.entries(statusCores).map(([status, cores]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={cn("w-3 h-3 rounded", cores.bg, cores.border, "border")} />
            <span className="text-xs text-muted-foreground capitalize">
              {status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});