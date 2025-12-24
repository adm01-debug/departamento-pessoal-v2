/**
 * @fileoverview Gráfico de barras com Recharts
 * @module components/charts/BarChart
 */
import { memo, useMemo } from 'react';
import { Bar, BarChart as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface BarChartProps {
  /** Título do gráfico */
  title: string;
  /** Dados do gráfico */
  data: DataPoint[];
  /** Cor das barras */
  color?: string;
  /** Campo de dados */
  dataKey?: string;
  /** Altura do gráfico */
  height?: number;
  /** Layout horizontal ou vertical */
  layout?: 'horizontal' | 'vertical';
}

/**
 * Gráfico de barras responsivo
 */
export const BarChart = memo(function BarChart({ 
  title, 
  data, 
  color = '#8884d8', 
  dataKey = 'value',
  height = 300,
  layout = 'horizontal'
}: BarChartProps) {
  const formattedData = useMemo(() => data, [data]);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBar data={formattedData} layout={layout}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey={layout === 'horizontal' ? 'name' : undefined}
              type={layout === 'horizontal' ? 'category' : 'number'}
              className="text-xs" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }} 
            />
            <YAxis 
              dataKey={layout === 'vertical' ? 'name' : undefined}
              type={layout === 'vertical' ? 'category' : 'number'}
              className="text-xs" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </RechartsBar>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

