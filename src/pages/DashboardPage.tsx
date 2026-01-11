// V15-221: src/pages/DashboardPage.tsx
import { PageLayout } from '@/components/layout';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <PageLayout title="Dashboard" description="Visão geral do departamento pessoal">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Colaboradores Ativos" value={142} icon={Users} trend={{ value: 2.5, label: 'vs mês anterior' }} />
        <StatCard title="Folha Mensal" value="R$ 485.000" icon={DollarSign} trend={{ value: -1.2, label: 'vs mês anterior' }} />
        <StatCard title="Férias Pendentes" value={12} icon={Calendar} description="Próximos 30 dias" />
        <StatCard title="Banco de Horas" value="+324h" icon={Clock} description="Saldo total" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Indicadores</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between"><span>Turnover</span><span className="font-bold">2.3%</span></div>
              <div className="flex justify-between"><span>Absenteísmo</span><span className="font-bold">1.8%</span></div>
              <div className="flex justify-between"><span>Headcount</span><span className="font-bold">142</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />Pendências</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• 5 férias vencendo em 30 dias</p>
              <p className="text-sm">• 3 colaboradores sem documentação</p>
              <p className="text-sm">• 2 atestados pendentes de lançamento</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
