import { memo } from 'react';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PayrollCostData {
  departamento: string;
  custoTotal: number;
  colaboradores: number;
  custoMedio: number;
}

interface PayrollCostChartProps {
  data: PayrollCostData[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--info))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--loggi))',
  'hsl(var(--sales))',
];

export function PayrollCostChart({ data }: PayrollCostChartProps) {
  const { chartData, totalCost } = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.custoTotal - a.custoTotal);
    const total = data.reduce((acc, item) => acc + item.custoTotal, 0);
    
    return {
      chartData: sorted.map(item => ({
        ...item,
        name: item.departamento.length > 12 
          ? item.departamento.substring(0, 12) + '...' 
          : item.departamento,
        percentual: total > 0 ? (item.custoTotal / total) * 100 : 0,
      })),
      totalCost: total,
    };
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCost)}</p>
          <p className="text-xs text-muted-foreground">Custo total da folha</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {formatCurrency(totalCost / (data.reduce((acc, d) => acc + d.colaboradores, 0) || 1))}
          </p>
          <p className="text-xs text-muted-foreground">Custo médio/colaborador</p>
        </div>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 10, right: 10, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as PayrollCostData & { percentual: number };
                  return (
                    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-medium text-foreground">{item.departamento}</p>
                      <p className="text-sm text-muted-foreground">
                        Custo: <span className="font-semibold text-foreground">{formatCurrency(item.custoTotal)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.colaboradores} colaboradores • {item.percentual.toFixed(1)}% do total
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Média: {formatCurrency(item.custoMedio)}/pessoa
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="custoTotal" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with percentages */}
      <div className="grid grid-cols-2 gap-2">
        {chartData.slice(0, 4).map((item, index) => (
          <div key={item.departamento} className="flex items-center gap-2 text-xs">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-muted-foreground truncate">{item.departamento}</span>
            <span className="font-medium text-foreground ml-auto">{item.percentual.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}



