import { memo } from 'react';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AbsenteeismData {
  departamento: string;
  faltas: number;
  atestados: number;
  taxaAbsenteismo: number;
}

interface AbsenteeismChartProps {
  data: AbsenteeismData[];
}

export function AbsenteeismChart({ data }: AbsenteeismChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      name: item.departamento.length > 10 
        ? item.departamento.substring(0, 10) + '...' 
        : item.departamento,
    }));
  }, [data]);

  const getColor = (rate: number) => {
    if (rate <= 2) return 'hsl(var(--success))';
    if (rate <= 5) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const avgRate = useMemo(() => {
    if (data.length === 0) return 0;
    return data.reduce((acc, item) => acc + item.taxaAbsenteismo, 0) / data.length;
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground">{avgRate.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Taxa média de absenteísmo</p>
        </div>
        <div 
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: `${getColor(avgRate)}20`,
            color: getColor(avgRate)
          }}
        >
          {avgRate <= 2 ? 'Saudável' : avgRate <= 5 ? 'Atenção' : 'Crítico'}
        </div>
      </div>
      
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10 }}>
            <XAxis type="number" domain={[0, 'auto']} tickFormatter={(v) => `${v}%`} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={80} 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as AbsenteeismData;
                  return (
                    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-medium text-foreground">{item.departamento}</p>
                      <p className="text-sm text-muted-foreground">
                        Taxa: <span className="font-semibold">{item.taxaAbsenteismo.toFixed(1)}%</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Faltas: {item.faltas} | Atestados: {item.atestados}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="taxaAbsenteismo" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.taxaAbsenteismo)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

