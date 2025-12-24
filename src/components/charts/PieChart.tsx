/**
 * @fileoverview Gráfico de pizza com Recharts
 * @module components/charts/PieChart
 */
import { memo, useMemo } from 'react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  title: string;
  data: DataPoint[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
}

const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];

export const PieChart = memo(function PieChart({ 
  title, 
  data, 
  colors = DEFAULT_COLORS,
  height = 300,
  showLegend = true
}: PieChartProps) {
  const formattedData = useMemo(() => data, [data]);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPie>
            <Pie data={formattedData} cx="50%" cy="50%" outerRadius="80%" dataKey="value" label>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            {showLegend && <Legend />}
          </RechartsPie>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

