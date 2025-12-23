import { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

import { useMemo } from 'react';

const statusConfig: Record<string, { label: string; color: string }> = {
  ativo: { label: 'Ativos', color: 'hsl(var(--success))' },
  ferias: { label: 'Férias', color: 'hsl(var(--warning))' },
  afastado: { label: 'Afastados', color: 'hsl(var(--loggi))' },
  desligado: { label: 'Desligados', color: 'hsl(var(--muted-foreground))' },
  admissao: { label: 'Em Admissão', color: 'hsl(var(--info))' },
};

interface StatusPieChartProps {
  colaboradores?: typeof [];
}

export function StatusPieChart({ colaboradores = [] }: StatusPieChartProps) {
  const data = useMemo(() => {
    const statusCount: Record<string, number> = {};
    
    colaboradores.forEach(c => {
      statusCount[c.status] = (statusCount[c.status] ?? 0) + 1;
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      name: statusConfig[status]?.label || status,
      value: count,
      color: statusConfig[status]?.color || 'hsl(var(--muted))',
    }));
  }, [colaboradores]);

  const total = colaboradores.length;

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number) => [`${value} colaboradores`, '']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-20px' }}>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  );
}




