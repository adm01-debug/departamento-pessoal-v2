import { memo } from 'react';
import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { TurnoverDetailModal } from './TurnoverDetailModal';
import { MousePointer2 } from 'lucide-react';

interface TurnoverMonthData {
  mes: string;
  mesLabel: string;
  admissoes: number;
  desligamentos: number;
  turnoverRate: number;
  totalColaboradores: number;
}

interface TurnoverEvolutionChartProps {
  data: TurnoverMonthData[];
  loading?: boolean;
}

export function TurnoverEvolutionChart({ data, loading }: TurnoverEvolutionChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<{ mes: string; mesLabel: string } | null>(null);
  
  const { chartData, avgRate, trend } = useMemo(() => {
    if (!data || data.length === 0) {
      return { chartData: [], avgRate: 0, trend: 0 };
    }

    const avg = data.reduce((acc, d) => acc + d.turnoverRate, 0) / data.length;
    
    // Calcular tendência (diferença entre média dos últimos 3 meses e primeiros 3 meses)
    const first3 = data.slice(0, 3);
    const last3 = data.slice(-3);
    const avgFirst = first3.reduce((acc, d) => acc + d.turnoverRate, 0) / first3.length;
    const avgLast = last3.reduce((acc, d) => acc + d.turnoverRate, 0) / last3.length;
    const trendValue = avgLast - avgFirst;

    return {
      chartData: data,
      avgRate: avg,
      trend: trendValue
    };
  }, [data]);

  const getColor = (rate: number) => {
    if (rate <= 5) return 'hsl(var(--success))';
    if (rate <= 10) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const handleChartClick = (data: { activePayload?: Array<{ payload: { month: string; rate: number } }> }) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const item = data.activePayload[0].payload as TurnoverMonthData;
      setSelectedMonth({ mes: item.mes, mesLabel: item.mesLabel });
    }
  };

  if (loading) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando dados...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Sem dados suficientes para exibir o gráfico</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{avgRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Média 12 meses</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${trend > 0 ? 'text-destructive' : 'text-success'}`}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Tendência</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {chartData.reduce((acc, d) => acc + d.admissoes + d.desligamentos, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Movimentações</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[200px] cursor-pointer" title="Clique em um ponto para ver detalhes">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ left: -10, right: 10, top: 10, bottom: 0 }}
              onClick={handleChartClick}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="mesLabel" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
                domain={[0, 'auto']}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as TurnoverMonthData;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-foreground">{item.mesLabel}</p>
                        <p className="text-sm" style={{ color: getColor(item.turnoverRate) }}>
                          Turnover: <span className="font-semibold">{item.turnoverRate.toFixed(1)}%</span>
                        </p>
                        <div className="mt-1 pt-1 border-t border-border text-xs text-muted-foreground">
                          <p>Admissões: <span className="text-success font-medium">{item.admissoes}</span></p>
                          <p>Desligamentos: <span className="text-destructive font-medium">{item.desligamentos}</span></p>
                          <p>Total colaboradores: {item.totalColaboradores}</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-xs text-primary">
                          <MousePointer2 className="w-3 h-3" />
                          Clique para ver detalhes
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine 
                y={avgRate} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5" 
                strokeOpacity={0.5}
              />
              <Line 
                type="monotone" 
                dataKey="turnoverRate" 
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4, cursor: 'pointer' }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))', cursor: 'pointer' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary" />
            <span className="text-muted-foreground">Taxa de Turnover</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-muted-foreground opacity-50" style={{ borderTop: '1px dashed' }} />
            <span className="text-muted-foreground">Média do período</span>
          </div>
          <div className="flex items-center gap-2">
            <MousePointer2 className="w-3 h-3 text-primary" />
            <span className="text-muted-foreground">Clique para detalhes</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <TurnoverDetailModal
        open={!!selectedMonth}
        onOpenChange={(open) => !open && setSelectedMonth(null)}
        mes={selectedMonth?.mes || ''}
        mesLabel={selectedMonth?.mesLabel || ''}
      />
    </>
  );
}



