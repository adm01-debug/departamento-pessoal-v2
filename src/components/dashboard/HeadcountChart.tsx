import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { mes: 'Jan', total: 100 },
  { mes: 'Fev', total: 102 },
  { mes: 'Mar', total: 105 },
  { mes: 'Abr', total: 108 },
  { mes: 'Mai', total: 110 },
  { mes: 'Jun', total: 115 },
];

export function HeadcountChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do Headcount</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
