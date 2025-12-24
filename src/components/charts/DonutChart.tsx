/**
 * @fileoverview Gráfico de rosca (donut) com Recharts
 * @module components/charts/DonutChart
 */
import { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  /** Título do gráfico */
  title: string;
  /** Dados do gráfico */
  data: DataPoint[];
  /** Paleta de cores */
  colors?: string[];
  /** Altura do gráfico */
  height?: number;
  /** Raio interno (0-1) */
  innerRadius?: number;
}

const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];

/**
 * Gráfico de rosca responsivo
 */
export const DonutChart = memo(function DonutChart({ 
  title, 
  data, 
  colors = DEFAULT_COLORS,
  height = 300,
  innerRadius = 0.6
}: DonutChartProps) {
  const formattedData = useMemo(() => data, [data]);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={`${innerRadius * 100}%`}
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

