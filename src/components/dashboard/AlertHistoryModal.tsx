import { useState, useEffect, useMemo, memo } from 'react';
import { logger } from '@/lib/logger';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subDays, subMonths, startOfDay, endOfDay, parseISO, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, History, AlertTriangle, TrendingUp, Activity, CalendarIcon, Filter, X, BarChart3, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';

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
  const [activeTab, setActiveTab] = useState<string>('chart');

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
      setHistory(data ?? []);
    } catch (error) {
      logger.error('Erro ao carregar histórico:', error);
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

  const chartData = useMemo(() => {
    if (!startDate || !endDate || history.length === 0) return [];

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    const rawData = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayAlerts = history.filter(h => 
        format(parseISO(h.created_at), 'yyyy-MM-dd') === dayStr
      );
      
      return {
        date: format(day, 'dd/MM', { locale: ptBR }),
        fullDate: dayStr,
        total: dayAlerts.length,
        warning: dayAlerts.filter(a => a.nivel === 'warning').length,
        critical: dayAlerts.filter(a => a.nivel === 'critical').length,
        turnover: dayAlerts.filter(a => a.tipo === 'turnover').length,
        absenteismo: dayAlerts.filter(a => a.tipo === 'absenteismo').length,
      };
    });

    // Calculate 7-day moving average
    const windowSize = 7;
    return rawData.map((item, index) => {
      const start = Math.max(0, index - windowSize + 1);
      const window = rawData.slice(start, index + 1);
      const avg = window.reduce((sum, d) => sum + d.total, 0) / window.length;
      
      return {
        ...item,
        movingAvg: Math.round(avg * 100) / 100,
      };
    });
  }, [history, startDate, endDate]);

  const summaryStats = useMemo(() => {
    const total = history.length;
    const critical = history.filter(h => h.nivel === 'critical').length;
    const warning = history.filter(h => h.nivel === 'warning').length;
    const turnover = history.filter(h => h.tipo === 'turnover').length;
    const absenteismo = history.filter(h => h.tipo === 'absenteismo').length;
    
    return { total, critical, warning, turnover, absenteismo };
  }, [history]);

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
      <DialogContent className="max-w-4xl max-h-[90vh]">
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
                    <Button aria-label="Ação" aria-label="Ação" variant="outline" size="sm" className="h-8 gap-2"><CalendarIcon className="w-3.5 h-3.5" />
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
                    <Button aria-label="Ação" aria-label="Ação" variant="outline" size="sm" className="h-8 gap-2"><CalendarIcon className="w-3.5 h-3.5" />
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
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-[300px] grid-cols-2">
              <TabsTrigger value="chart" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Gráfico
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="w-4 h-4" />
                Lista
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="mt-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium">Nenhum dado para exibir</p>
                  <p className="text-xs">Tente ajustar os filtros</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-5 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <div className="text-2xl font-bold">{summaryStats.total}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="p-3 rounded-lg bg-destructive/10 text-center">
                      <div className="text-2xl font-bold text-destructive">{summaryStats.critical}</div>
                      <div className="text-xs text-muted-foreground">Críticos</div>
                    </div>
                    <div className="p-3 rounded-lg bg-warning/10 text-center">
                      <div className="text-2xl font-bold text-warning">{summaryStats.warning}</div>
                      <div className="text-xs text-muted-foreground">Alertas</div>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10 text-center">
                      <div className="text-2xl font-bold text-primary">{summaryStats.turnover}</div>
                      <div className="text-xs text-muted-foreground">Turnover</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary text-center">
                      <div className="text-2xl font-bold">{summaryStats.absenteismo}</div>
                      <div className="text-xs text-muted-foreground">Absenteísmo</div>
                    </div>
                  </div>

                  {/* Trend Chart */}
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 11 }} 
                          className="text-muted-foreground"
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }} 
                          className="text-muted-foreground"
                          allowDecimals={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--popover))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: number, name: string) => {
                            const labels: Record<string, string> = {
                              warning: 'Alertas',
                              critical: 'Críticos',
                              movingAvg: 'Média Móvel (7d)'
                            };
                            return [value, labels[name] || name];
                          }}
                        />
                        <Legend 
                          formatter={(value) => {
                            const labels: Record<string, string> = {
                              warning: 'Alertas',
                              critical: 'Críticos',
                              movingAvg: 'Média Móvel (7d)'
                            };
                            return labels[value] || value;
                          }}
                        />
                        <Bar dataKey="warning" stackId="a" fill="hsl(var(--warning))" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="critical" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                        <Line 
                          type="monotone" 
                          dataKey="movingAvg" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={false}
                          strokeDasharray="5 5"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="mt-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <History className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium">Nenhum alerta encontrado</p>
                  <p className="text-xs">Tente ajustar os filtros</p>
                </div>
              ) : (
                <ScrollArea className="h-[380px] pr-4">
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
            </TabsContent>
          </Tabs>
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
