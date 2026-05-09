import { useFerias } from '@/hooks/useFerias';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, Info, FileText } from 'lucide-react';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { Separator } from '@/components/ui/separator';

export function CalendarioFerias() {
  const { ferias } = useFerias();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const feriasNoMes = ferias.filter((f: any) => {
    if (f.status === 'cancelada' || f.status === 'rejeitada') return false;
    const start = new Date(f.data_inicio);
    const end = new Date(f.data_fim);
    return (
      isWithinInterval(start, { start: monthStart, end: monthEnd }) ||
      isWithinInterval(end, { start: monthStart, end: monthEnd }) ||
      (start < monthStart && end > monthEnd)
    );
  }).sort((a: any, b: any) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada': return 'bg-success/10 border-success/30 text-success';
      case 'em_gozo': return 'bg-info/10 border-info/30 text-info';
      case 'pendente': return 'bg-warning/10 border-warning/30 text-warning';
      case 'concluida': return 'bg-muted/50 border-border/40 text-muted-foreground';
      default: return 'bg-muted/10 border-border/20';
    }
  };

  return (
    <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Calendário de Férias
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-display font-medium min-w-[120px] text-center capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {!feriasNoMes.length ? (
            <div className="text-center py-12 text-muted-foreground font-body">
              Nenhuma férias programada para este mês.
            </div>
          ) : (
            feriasNoMes.map((f: any) => {
              const start = new Date(f.data_inicio);
              const end = new Date(f.data_fim);
              return (
                <div key={f.id} className="flex items-start gap-4 p-4 rounded-xl border border-border/30 hover:bg-muted/10 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-sm">{f.colaborador?.nome_completo}</h4>
                      <Badge variant={f.status === 'aprovada' ? 'default' : 'secondary'} className="text-[10px]">
                        {f.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-body">
                      {format(start, 'dd/MM/yyyy')} até {format(end, 'dd/MM/yyyy')} 
                      <span className="mx-2">•</span>
                      {f.dias_ferias} dias
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
