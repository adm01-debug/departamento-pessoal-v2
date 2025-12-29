/**
 * @fileoverview Gráfico comparativo anual de turnover
 * @module components/dashboard/TurnoverYearComparisonChart
 * @version V8.2 - Import duplicado corrigido
 */
import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

interface TurnoverYearData {
  ano: number;
  admissoes: number;
  desligamentos: number;
  turnover: number;
}

interface TurnoverYearComparisonChartProps {
  data: TurnoverYearData[];
  loading?: boolean;
}

export const TurnoverYearComparisonChart = memo(function TurnoverYearComparisonChart({ data, loading }: TurnoverYearComparisonChartProps) {
  if (loading) {
    return (
      <div className="p-5 rounded-xl bg-card border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4">Comparativo Anual</h3>
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-5 rounded-xl bg-card border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4">Comparativo Anual</h3>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
          Sem dados para comparação
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Comparativo Anual</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          Últimos {data.length} anos
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="ano" 
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
          />
          <YAxis 
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar 
            dataKey="admissoes" 
            name="Admissões"
            fill="hsl(var(--success))" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="desligamentos" 
            name="Desligamentos"
            fill="hsl(var(--destructive))" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
