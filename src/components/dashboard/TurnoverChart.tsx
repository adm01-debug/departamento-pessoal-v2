import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { mes: 'Jan', admissoes: 5, desligamentos: 2 },
  { mes: 'Fev', admissoes: 3, desligamentos: 4 },
  { mes: 'Mar', admissoes: 6, desligamentos: 1 },
  { mes: 'Abr', admissoes: 4, desligamentos: 3 },
  { mes: 'Mai', admissoes: 7, desligamentos: 2 },
  { mes: 'Jun', admissoes: 5, desligamentos: 5 },
];

export function TurnoverChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Turnover</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="admissoes" fill="hsl(var(--primary))" name="Admissões" />
            <Bar dataKey="desligamentos" fill="hsl(var(--destructive))" name="Desligamentos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
