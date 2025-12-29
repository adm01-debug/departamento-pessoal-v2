/**
 * @fileoverview Gráfico de evolução de turnover
 * @module components/dashboard/TurnoverEvolutionChart
 * @version V8.2 - Import duplicado corrigido
 */
import { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

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

export const TurnoverEvolutionChart = memo(function TurnoverEvolutionChart({ data, loading }: TurnoverEvolutionChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="mesLabel" 
          tick={{ fontSize: 11 }}
          className="text-muted-foreground"
        />
        <YAxis 
          tick={{ fontSize: 11 }}
          className="text-muted-foreground"
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Turnover']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="turnoverRate" 
          name="Taxa de Turnover"
          stroke="hsl(var(--warning))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="admissoes" 
          name="Admissões"
          stroke="hsl(var(--success))" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 3 }}
        />
        <Line 
          type="monotone" 
          dataKey="desligamentos" 
          name="Desligamentos"
          stroke="hsl(var(--destructive))" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});
