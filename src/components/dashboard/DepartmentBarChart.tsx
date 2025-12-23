import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { useMemo } from 'react';

const colors = [
  'hsl(var(--primary))',
  'hsl(var(--info))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--store))',
  'hsl(var(--sales))',
  'hsl(var(--loggi))',
];

interface DepartmentBarChartProps {
  colaboradores?: typeof [];
}

export function DepartmentBarChart({ colaboradores = [] }: DepartmentBarChartProps) {
  const data = useMemo(() => {
    const deptCount: Record<string, number> = {};
    
    colaboradores.forEach(c => {
      deptCount[c.departamento] = (deptCount[c.departamento] ?? 0) + 1;
    });

    return Object.entries(deptCount)
      .map(([dept, count]) => ({
        name: dept,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [colaboradores]);

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            type="number" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            width={100}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number) => [`${value} colaboradores`, '']}
            cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]}
            maxBarSize={24}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}




