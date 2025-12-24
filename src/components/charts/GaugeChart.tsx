/**
 * @fileoverview Gráfico de medidor (gauge) com Recharts
 * @module components/charts/GaugeChart
 */
import { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GaugeChartProps {
  title: string;
  value: number;
  label?: string;
  colors?: [string, string, string];
  height?: number;
}

const DEFAULT_COLORS: [string, string, string] = ['#ef4444', '#eab308', '#22c55e'];

export const GaugeChart = memo(function GaugeChart({ 
  title, 
  value,
  label,
  colors = DEFAULT_COLORS,
  height = 200
}: GaugeChartProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  const data = useMemo(() => [
    { value: clampedValue, name: 'value' },
    { value: 100 - clampedValue, name: 'remaining' }
  ], [clampedValue]);

  const getColor = (val: number) => {
    if (val < 33) return colors[0];
    if (val < 66) return colors[1];
    return colors[2];
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={data} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius="60%" outerRadius="100%" dataKey="value">
              <Cell fill={getColor(clampedValue)} />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <p className="text-3xl font-bold">{clampedValue}%</p>
          {label && <p className="text-xs text-muted-foreground">{label}</p>}
        </div>
      </CardContent>
    </Card>
  );
});

