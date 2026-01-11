// V15-268: src/components/charts/LineChart.tsx
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LineChartProps {
  title: string;
  data: any[];
  xKey: string;
  lines: Array<{ dataKey: string; color: string; name: string }>;
  height?: number;
}

export function LineChart({ title, data, xKey, lines, height = 300 }: LineChartProps) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLine data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            {lines.map((l) => (
              <Line key={l.dataKey} type="monotone" dataKey={l.dataKey} stroke={l.color} name={l.name} strokeWidth={2} />
            ))}
          </RechartsLine>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
