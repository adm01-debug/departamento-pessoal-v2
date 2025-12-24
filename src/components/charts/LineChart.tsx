/**
 * @fileoverview Gráfico de linha com Recharts
 * @module components/charts/LineChart
 */
import { memo, useMemo } from 'react';
import { Line, LineChart as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface LineChartProps {
  title: string;
  data: DataPoint[];
  color?: string;
  dataKey?: string;
  height?: number;
  showDots?: boolean;
}

export const LineChart = memo(function LineChart({ 
  title, 
  data, 
  color = '#8884d8', 
  dataKey = 'value',
  height = 300,
  showDots = true
}: LineChartProps) {
  const formattedData = useMemo(() => data, [data]);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLine data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={showDots} activeDot={{ r: 6 }} />
          </RechartsLine>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

