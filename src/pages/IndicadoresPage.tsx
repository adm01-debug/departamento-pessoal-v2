// V15-413
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, PieChart } from '@/components/charts';
import { Users, TrendingUp, TrendingDown, Clock } from 'lucide-react';
const turnoverData = [{ mes: 'Jul', valor: 2.1 }, { mes: 'Ago', valor: 1.8 }, { mes: 'Set', valor: 2.5 }, { mes: 'Out', valor: 1.9 }, { mes: 'Nov', valor: 2.0 }, { mes: 'Dez', valor: 2.3 }];
const absenteismoData = [{ mes: 'Jul', valor: 1.5 }, { mes: 'Ago', valor: 1.8 }, { mes: 'Set', valor: 1.2 }, { mes: 'Out', valor: 1.6 }, { mes: 'Nov', valor: 1.4 }, { mes: 'Dez', valor: 1.8 }];
const composicaoData = [{ name: 'CLT', value: 120, color: '#3b82f6' }, { name: 'PJ', value: 15, color: '#22c55e' }, { name: 'Estágio', value: 7, color: '#f59e0b' }];
export default function IndicadoresPage() {
  return (
    <PageLayout title="Indicadores RH">
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card><CardContent className="pt-6 flex items-center gap-4"><Users className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">142</p><p className="text-sm text-muted-foreground">Headcount</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><TrendingDown className="h-8 w-8 text-red-600" /><div><p className="text-2xl font-bold">2.3%</p><p className="text-sm text-muted-foreground">Turnover</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><Clock className="h-8 w-8 text-yellow-600" /><div><p className="text-2xl font-bold">1.8%</p><p className="text-sm text-muted-foreground">Absenteísmo</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><TrendingUp className="h-8 w-8 text-green-600" /><div><p className="text-2xl font-bold">4.2</p><p className="text-sm text-muted-foreground">Tempo Médio (anos)</p></div></CardContent></Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LineChart title="Turnover Mensal (%)" data={turnoverData} xKey="mes" lines={[{ dataKey: 'valor', color: '#ef4444', name: 'Turnover' }]} />
        <LineChart title="Absenteísmo Mensal (%)" data={absenteismoData} xKey="mes" lines={[{ dataKey: 'valor', color: '#f59e0b', name: 'Absenteísmo' }]} />
        <PieChart title="Composição por Contrato" data={composicaoData} />
      </div>
    </PageLayout>
  );
}
