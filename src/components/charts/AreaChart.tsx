/**
 * @fileoverview Gráfico de área com Recharts
 * @module components/charts/AreaChart
 */
import { memo, useMemo } from 'react';
import { Area, AreaChart as RechartsArea, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface AreaChartProps {
  /** Título do gráfico */
  title: string;
  /** Dados do gráfico */
  data: DataPoint[];
  /** Cor da área */
  color?: string;
  /** Campo de dados a ser usado */
  dataKey?: string;
  /** Altura do gráfico */
  height?: number;
}

/**
 * Gráfico de área responsivo
 */
export const AreaChart = memo(function AreaChart({ 
  title, 
  data, 
  color = '#8884d8', 
  dataKey = 'value',
  height = 300 
}: AreaChartProps) {
  const formattedData = useMemo(() => data, [data]);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsArea data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} />
          </RechartsArea>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

