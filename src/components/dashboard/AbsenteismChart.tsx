import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { mes: 'Jan', taxa: 2.5 },
  { mes: 'Fev', taxa: 3.1 },
  { mes: 'Mar', taxa: 2.8 },
  { mes: 'Abr', taxa: 2.2 },
  { mes: 'Mai', taxa: 2.9 },
  { mes: 'Jun', taxa: 3.5 },
];

export function AbsenteismChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de Absenteísmo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="taxa" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
