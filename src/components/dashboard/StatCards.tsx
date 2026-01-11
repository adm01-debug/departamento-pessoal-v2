// V15-264: src/components/dashboard/StatCards.tsx
import { StatCard } from '@/components/ui/stat-card';
import { Users, DollarSign, Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface DashboardStats {
  colaboradoresAtivos: number;
  folhaMensal: number;
  feriasPendentes: number;
  bancoHoras: string;
  tendencia?: { colaboradores?: number; folha?: number };
}

export function StatCards({ stats }: { stats: DashboardStats }) {
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Colaboradores Ativos" value={stats.colaboradoresAtivos} icon={Users} trend={stats.tendencia?.colaboradores ? { value: stats.tendencia.colaboradores, label: 'vs mês anterior' } : undefined} />
      <StatCard title="Folha Mensal" value={fmt(stats.folhaMensal)} icon={DollarSign} trend={stats.tendencia?.folha ? { value: stats.tendencia.folha, label: 'vs mês anterior' } : undefined} />
      <StatCard title="Férias Pendentes" value={stats.feriasPendentes} icon={Calendar} description="Próximos 30 dias" />
      <StatCard title="Banco de Horas" value={stats.bancoHoras} icon={Clock} description="Saldo total" />
    </div>
  );
}
