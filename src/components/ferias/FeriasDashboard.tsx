import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Calendar, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FeriasDashboardProps {
  data: any[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

export function FeriasDashboard({ data }: FeriasDashboardProps) {
  // Prepara dados para gráfico de barras (últimos 6 meses)
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  const barData = last6Months.map(month => {
    const monthStr = format(month, 'MMM', { locale: ptBR });
    const count = data.filter(f => {
      const d = new Date(f.data_inicio);
      return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
    }).length;
    return { name: monthStr, total: count };
  });

  // Prepara dados para gráfico de pizza (status)
  const statusCount = data.reduce((acc: any, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCount).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: statusCount[key]
  }));

  // Próximos em gozo
  const proximos = [...data]
    .filter(f => new Date(f.data_inicio) >= new Date() && f.status === 'aprovada')
    .sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime())
    .slice(0, 5);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/40 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> Férias nos Últimos 6 Meses
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" /> Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm rounded-2xl md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Próximos Colaboradores em Gozo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!proximos.length ? (
              <p className="text-center py-6 text-muted-foreground font-body">Nenhuma férias aprovada para o futuro próximo.</p>
            ) : (
              proximos.map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border border-border/20 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold font-display">{f.colaborador?.nome_completo}</p>
                      <p className="text-xs text-muted-foreground font-body">
                        {format(new Date(f.data_inicio), 'dd/MM/yyyy')} a {format(new Date(f.data_fim), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {f.dias_ferias} dias
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
