/**
 * @fileoverview Gráfico de absenteísmo por departamento
 * @module components/dashboard/AbsenteeismChart
 * @version V8.2 - Import duplicado corrigido
 */
import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AbsenteeismData {
  departamento: string;
  faltas: number;
  atestados: number;
  taxaAbsenteismo: number;
}

interface AbsenteeismChartProps {
  data: AbsenteeismData[];
}

const COLORS = {
  faltas: 'hsl(var(--destructive))',
  atestados: 'hsl(var(--warning))',
};

export const AbsenteeismChart = memo(function AbsenteeismChart({ data }: AbsenteeismChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
        Sem dados de absenteísmo
      </div>
    );
  }

  // Preparar dados para o gráfico
  const chartData = data.map(d => ({
    departamento: d.departamento.length > 10 ? d.departamento.substring(0, 10) + '...' : d.departamento,
    departamentoFull: d.departamento,
    faltas: d.faltas,
    atestados: d.atestados,
    total: d.faltas + d.atestados,
    taxa: d.taxaAbsenteismo,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <YAxis 
          type="category" 
          dataKey="departamento" 
          tick={{ fontSize: 10 }} 
          width={80}
          className="text-muted-foreground"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px'
          }}
          formatter={(value: number, name: string) => {
            const label = name === 'faltas' ? 'Faltas' : 'Atestados';
            return [`${value} dias`, label];
          }}
          labelFormatter={(label: string, payload: unknown[]) => {
            if (payload?.[0]) {
              const item = payload[0] as { payload: { departamentoFull: string; taxa: number } };
              return `${item.payload.departamentoFull} (${item.payload.taxa.toFixed(1)}%)`;
            }
            return label;
          }}
        />
        <Bar 
          dataKey="faltas" 
          stackId="a"
          fill={COLORS.faltas}
          radius={[0, 0, 0, 0]}
          name="faltas"
        />
        <Bar 
          dataKey="atestados" 
          stackId="a"
          fill={COLORS.atestados}
          radius={[0, 4, 4, 0]}
          name="atestados"
        />
      </BarChart>
    </ResponsiveContainer>
  );
});
