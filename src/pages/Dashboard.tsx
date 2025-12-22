import { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Umbrella, 
  Heart, 
  Clock, 
  Wallet, 
  UserMinus, 
  AlertTriangle,
  PieChart,
  BarChart3,
  TrendingUp,
  Calendar as CalendarIcon,
  RefreshCcw,
  Activity,
  DollarSign,
  Loader2
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { DepartmentBarChart } from '@/components/dashboard/DepartmentBarChart';
import { StatusPieChart } from '@/components/dashboard/StatusPieChart';
import { AdmissionsLineChart } from '@/components/dashboard/AdmissionsLineChart';
import { MiniCalendar } from '@/components/dashboard/MiniCalendar';
import { TurnoverGauge } from '@/components/dashboard/TurnoverGauge';
import { TurnoverEvolutionChart } from '@/components/dashboard/TurnoverEvolutionChart';
import { TurnoverYearComparisonChart } from '@/components/dashboard/TurnoverYearComparisonChart';
import { AbsenteeismChart } from '@/components/dashboard/AbsenteeismChart';
import { PayrollCostChart } from '@/components/dashboard/PayrollCostChart';
import { IndicatorAlertsCard } from '@/components/dashboard/IndicatorAlertsCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useNavigate } from 'react-router-dom';
import { subMonths, subQuarters, subYears, isAfter } from 'date-fns';
import { useColaboradores } from '@/hooks/useColaboradores';
import { useIndicadoresDP } from '@/hooks/useIndicadoresDP';

type PeriodFilter = 'all' | 'month' | 'quarter' | 'year';

const periodLabels: Record<PeriodFilter, string> = {
  all: 'Todo período',
  month: 'Último mês',
  quarter: 'Último trimestre',
  year: 'Último ano',
};

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard | DP System';
  }, []);

  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodFilter>('year');
  
  // Hook para indicadores de DP com dados reais
  const indicadoresPeriodo = period === 'all' ? 'year' : period;
  const indicadores = useIndicadoresDP(indicadoresPeriodo as 'month' | 'quarter' | 'year');

  // Calcular taxa média de absenteísmo
  const avgAbsenteeismRate = useMemo(() => {
    if (indicadores.absenteeism.length === 0) return 0;
    const total = indicadores.absenteeism.reduce((acc, d) => acc + d.taxaAbsenteismo, 0);
    return total / indicadores.absenteeism.length;
  }, [indicadores.absenteeism]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Filtrar colaboradores por período de admissão (para gráficos visuais)
  const filteredColaboradores = useMemo(() => {
    if (period === 'all') return colaboradoresData;

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'quarter':
        startDate = subQuarters(now, 1);
        break;
      case 'year':
        startDate = subYears(now, 1);
        break;
      default:
        return colaboradoresData;
    }

    return colaboradoresData.filter(c => 
      isAfter(new Date(c.dataAdmissao), startDate)
    );
  }, [period]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral do Departamento Pessoal</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
          {indicadores.loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Carregando...</span>
            </>
          ) : (
            <>
              <span className="status-dot status-dot-success" />
              <span className="text-sm text-muted-foreground">Dados atualizados</span>
            </>
          )}
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard 
          icon={Users} 
          label="Colaboradores Ativos" 
          value={indicadores.kpis.colaboradoresAtivos}
          subtitle="colaboradores"
          colorClass="text-info"
          onClick={() => navigate('/colaboradores')}
        />
        <KPICard 
          icon={UserPlus} 
          label="Admissões em Curso" 
          value={indicadores.kpis.admissoesEmCurso}
          subtitle="em processo"
          colorClass="text-success"
          onClick={() => navigate('/admissao')}
        />
        <KPICard 
          icon={Umbrella} 
          label="Férias Este Mês" 
          value={indicadores.kpis.feriasEsteMes}
          subtitle="programadas"
          colorClass="text-warning"
          onClick={() => navigate('/ferias')}
        />
        <KPICard 
          icon={Heart} 
          label="Afastados Hoje" 
          value={indicadores.kpis.afastadosHoje}
          subtitle="licenças ativas"
          colorClass="text-loggi"
          onClick={() => navigate('/afastamentos')}
        />
        <KPICard 
          icon={Clock} 
          label="Pontos Pendentes" 
          value={indicadores.kpis.pontosPendentes}
          subtitle="aguardando aprovação"
          colorClass="text-info"
          onClick={() => navigate('/ponto')}
        />
        <KPICard 
          icon={Wallet} 
          label="Folha Projetada" 
          value={formatCurrency(indicadores.kpis.folhaProjetada)}
          trend={indicadores.kpis.folhaProjetada > 0 ? { value: 3, positive: false } : undefined}
          colorClass="text-sales"
          onClick={() => navigate('/folha')}
        />
        <KPICard 
          icon={UserMinus} 
          label="Desligamentos" 
          value={indicadores.kpis.desligamentosEmCurso}
          subtitle="no período"
          colorClass="text-destructive"
          onClick={() => navigate('/desligamento')}
        />
        <KPICard 
          icon={AlertTriangle} 
          label="Alertas Urgentes" 
          value={indicadores.kpis.alertasUrgentes}
          subtitle="requerem ação"
          colorClass="text-destructive"
        />
      </div>

      {/* Indicadores de DP */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Alertas de Indicadores */}
        <IndicatorAlertsCard 
          turnoverRate={indicadores.turnover.turnoverRate}
          absenteeismRate={avgAbsenteeismRate}
        />

        {/* Turnover */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-warning" />
              Taxa de Turnover
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Último ano
            </span>
          </div>
          <TurnoverGauge 
            admissoes={indicadores.turnover.admissoes}
            desligamentos={indicadores.turnover.desligamentos}
            totalColaboradores={indicadores.turnover.totalColaboradores}
          />
        </div>

        {/* Absenteísmo */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-destructive" />
              Absenteísmo por Departamento
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Mês atual
            </span>
          </div>
          <AbsenteeismChart data={indicadores.absenteeism.length > 0 ? indicadores.absenteeism : [
            { departamento: 'Sem dados', faltas: 0, atestados: 0, taxaAbsenteismo: 0 }
          ]} />
        </div>

        {/* Custo de Folha */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-success" />
              Custo de Folha por Departamento
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {periodLabels[period]}
            </span>
          </div>
          <PayrollCostChart data={indicadores.payrollCost.length > 0 ? indicadores.payrollCost : [
            { departamento: 'Sem dados', custoTotal: 0, colaboradores: 0, custoMedio: 0 }
          ]} />
        </div>
      </div>

      {/* Gráficos de Turnover */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Evolução do Turnover */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-warning" />
              Evolução do Turnover
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Últimos 12 meses
            </span>
          </div>
          <TurnoverEvolutionChart 
            data={indicadores.turnoverEvolution} 
            loading={indicadores.loading}
          />
        </div>

        {/* Comparativo Anual */}
        <TurnoverYearComparisonChart 
          data={indicadores.turnoverYearComparison}
          loading={indicadores.loading}
        />
      </div>

      {/* Filtro de Período */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Análise de Colaboradores</h2>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {Object.entries(periodLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfico por Departamento */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Colaboradores por Departamento
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {filteredColaboradores.length} total
            </span>
          </div>
          <DepartmentBarChart colaboradores={filteredColaboradores} />
        </div>

        {/* Gráfico por Status */}
        <div className="p-5 rounded-xl bg-card border border-border relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <PieChart className="w-4 h-4 text-info" />
              Distribuição por Status
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {periodLabels[period]}
            </span>
          </div>
          <StatusPieChart colaboradores={filteredColaboradores} />
        </div>
      </div>

      {/* Gráfico de Evolução */}
      <div className="p-5 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            Evolução de Admissões
          </h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            Últimos 12 meses
          </span>
        </div>
        <AdmissionsLineChart colaboradores={colaboradoresData} months={12} />
      </div>

      {/* Alertas */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Alertas Urgentes
          </h3>
          <AlertsList alertas={alertasData.slice(0, 5)} />
        </div>

        {/* Calendar */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            📅 Calendário do Mês
          </h3>
          <MiniCalendar eventos={eventosCalendario} />
        </div>
      </div>
    </div>
  );
}


