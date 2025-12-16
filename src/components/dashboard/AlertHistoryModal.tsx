import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, History, AlertTriangle, TrendingUp, Activity, CalendarIcon, Filter, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface AlertHistoryItem {
  id: string;
  tipo: string;
  nivel: string;
  valor: number;
  limite: number;
  mensagem: string;
  created_at: string;
}

interface AlertHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type QuickFilter = 'all' | '7days' | '30days' | '90days' | 'custom';

export function AlertHistoryModal({ open, onOpenChange }: AlertHistoryModalProps) {
  const [history, setHistory] = useState<AlertHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('30days');
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [tipoFilter, setTipoFilter] = useState<string>('all');
  const [nivelFilter, setNivelFilter] = useState<string>('all');

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open, startDate, endDate, tipoFilter, nivelFilter]);

  const handleQuickFilterChange = (value: QuickFilter) => {
    setQuickFilter(value);
    const now = new Date();
    
    switch (value) {
      case '7days':
        setStartDate(subDays(now, 7));
        setEndDate(now);
        break;
      case '30days':
        setStartDate(subDays(now, 30));
        setEndDate(now);
        break;
      case '90days':
        setStartDate(subMonths(now, 3));
        setEndDate(now);
        break;
      case 'all':
        setStartDate(undefined);
        setEndDate(undefined);
        break;
      case 'custom':
        // Keep current dates
        break;
    }
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('historico_alertas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (startDate) {
        query = query.gte('created_at', startOfDay(startDate).toISOString());
      }
      if (endDate) {
        query = query.lte('created_at', endOfDay(endDate).toISOString());
      }
      if (tipoFilter !== 'all') {
        query = query.eq('tipo', tipoFilter);
      }
      if (nivelFilter !== 'all') {
        query = query.eq('nivel', nivelFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setQuickFilter('30days');
    setStartDate(subDays(new Date(), 30));
    setEndDate(new Date());
    setTipoFilter('all');
    setNivelFilter('all');
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'turnover':
        return <TrendingUp className="w-4 h-4" />;
      case 'absenteismo':
        return <Activity className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'turnover':
        return 'Turnover';
      case 'absenteismo':
        return 'Absenteísmo';
      default:
        return tipo;
    }
  };

  const getLevelBadge = (nivel: string) => {
    switch (nivel) {
      case 'critical':
        return <Badge variant="destructive">Crítico</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">Alerta</Badge>;
      default:
        return <Badge variant="secondary">{nivel}</Badge>;
    }
  };

  const hasActiveFilters = tipoFilter !== 'all' || nivelFilter !== 'all' || quickFilter !== '30days';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Alertas
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-3 pb-3 border-b">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={quickFilter} onValueChange={(v) => handleQuickFilterChange(v as QuickFilter)}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                <SelectItem value="30days">Últimos 30 dias</SelectItem>
                <SelectItem value="90days">Últimos 90 dias</SelectItem>
                <SelectItem value="all">Todo período</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {quickFilter === 'custom' && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {startDate ? format(startDate, 'dd/MM/yy', { locale: ptBR }) : 'Início'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-muted-foreground text-sm">até</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {endDate ? format(endDate, 'dd/MM/yy', { locale: ptBR }) : 'Fim'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </>
            )}

            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos tipos</SelectItem>
                <SelectItem value="turnover">Turnover</SelectItem>
                <SelectItem value="absenteismo">Absenteísmo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={nivelFilter} onValueChange={setNivelFilter}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos níveis</SelectItem>
                <SelectItem value="warning">Alerta</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={clearFilters}>
                <X className="w-3.5 h-3.5" />
                Limpar
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {loading ? 'Carregando...' : `${history.length} alerta(s) encontrado(s)`}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">Nenhum alerta encontrado</p>
            <p className="text-xs">Tente ajustar os filtros</p>
          </div>
        ) : (
          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    item.nivel === 'critical'
                      ? 'bg-destructive/5 border-destructive/20'
                      : 'bg-warning/5 border-warning/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          item.nivel === 'critical'
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-warning/20 text-warning'
                        }`}
                      >
                        {getTypeIcon(item.tipo)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {getTypeLabel(item.tipo)}
                          </span>
                          {getLevelBadge(item.nivel)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.mensagem}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Valor: {item.valor.toFixed(1)}%</span>
                          <span>Limite: {item.limite}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      <div>{format(new Date(item.created_at), 'dd/MM/yyyy', { locale: ptBR })}</div>
                      <div>{format(new Date(item.created_at), 'HH:mm', { locale: ptBR })}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
