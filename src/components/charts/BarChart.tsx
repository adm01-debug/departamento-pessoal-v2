// V15-269: src/components/charts/BarChart.tsx
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartProps {
  title: string;
  data: any[];
  xKey: string;
  bars: Array<{ dataKey: string; color: string; name: string }>;
  height?: number;
}

export function BarChart({ title, data, xKey, bars, height = 300 }: BarChartProps) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBar data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            {bars.map((b) => (
              <Bar key={b.dataKey} dataKey={b.dataKey} fill={b.color} name={b.name} />
            ))}
          </RechartsBar>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
