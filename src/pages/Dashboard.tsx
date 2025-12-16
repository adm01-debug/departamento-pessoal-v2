import { useState, useMemo } from 'react';
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
  DollarSign
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { DepartmentBarChart } from '@/components/dashboard/DepartmentBarChart';
import { StatusPieChart } from '@/components/dashboard/StatusPieChart';
import { AdmissionsLineChart } from '@/components/dashboard/AdmissionsLineChart';
import { MiniCalendar } from '@/components/dashboard/MiniCalendar';
import { TurnoverGauge } from '@/components/dashboard/TurnoverGauge';
import { AbsenteeismChart } from '@/components/dashboard/AbsenteeismChart';
import { PayrollCostChart } from '@/components/dashboard/PayrollCostChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockKPIs, mockAlertas, mockCalendarioEventos, mockColaboradores } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { subMonths, subQuarters, subYears, isAfter } from 'date-fns';

type PeriodFilter = 'all' | 'month' | 'quarter' | 'year';

const periodLabels: Record<PeriodFilter, string> = {
  all: 'Todo período',
  month: 'Último mês',
  quarter: 'Último trimestre',
  year: 'Último ano',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodFilter>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Filtrar colaboradores por período de admissão
  const filteredColaboradores = useMemo(() => {
    if (period === 'all') return mockColaboradores;

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
        return mockColaboradores;
    }

    return mockColaboradores.filter(c => 
      isAfter(new Date(c.dataAdmissao), startDate)
    );
  }, [period]);

  // Dados mockados para indicadores de DP
  const dpIndicators = useMemo(() => {
    // Simulação de dados de turnover
    const admissoes = 5; // admissões no período
    const desligamentos = 2; // desligamentos no período
    const totalColaboradores = mockKPIs.colaboradoresAtivos;
    
    // Taxa de turnover: ((Admissões + Desligamentos) / 2) / Total * 100
    const turnoverRate = ((admissoes + desligamentos) / 2) / totalColaboradores * 100;

    // Dados de absenteísmo por departamento
    const absenteeismData = [
      { departamento: 'Gravação', faltas: 8, atestados: 12, taxaAbsenteismo: 4.2 },
      { departamento: 'Comercial', faltas: 3, atestados: 5, taxaAbsenteismo: 2.1 },
      { departamento: 'Artes', faltas: 2, atestados: 4, taxaAbsenteismo: 1.8 },
      { departamento: 'Logística', faltas: 5, atestados: 8, taxaAbsenteismo: 5.5 },
      { departamento: 'Administrativo', faltas: 1, atestados: 2, taxaAbsenteismo: 1.2 },
      { departamento: 'Financeiro', faltas: 0, atestados: 1, taxaAbsenteismo: 0.8 },
    ];

    // Custo de folha por departamento
    const payrollCostData = [
      { departamento: 'Gravação', custoTotal: 63000, colaboradores: 18, custoMedio: 3500 },
      { departamento: 'Comercial', custoTotal: 45600, colaboradores: 12, custoMedio: 3800 },
      { departamento: 'Artes', custoTotal: 33600, colaboradores: 8, custoMedio: 4200 },
      { departamento: 'Logística', custoTotal: 19200, colaboradores: 6, custoMedio: 3200 },
      { departamento: 'Administrativo', custoTotal: 14000, colaboradores: 4, custoMedio: 3500 },
      { departamento: 'Financeiro', custoTotal: 9600, colaboradores: 3, custoMedio: 3200 },
    ];

    return {
      admissoes,
      desligamentos,
      totalColaboradores,
      turnoverRate,
      absenteeismData,
      payrollCostData,
    };
  }, []);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral do Departamento Pessoal</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
          <span className="status-dot status-dot-success" />
          <span className="text-sm text-muted-foreground">Sistema Online</span>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard 
          icon={Users} 
          label="Colaboradores Ativos" 
          value={mockKPIs.colaboradoresAtivos}
          subtitle="colaboradores"
          colorClass="text-info"
          onClick={() => navigate('/colaboradores')}
        />
        <KPICard 
          icon={UserPlus} 
          label="Admissões em Curso" 
          value={mockKPIs.admissoesEmCurso}
          subtitle="em processo"
          colorClass="text-success"
          onClick={() => navigate('/admissao')}
        />
        <KPICard 
          icon={Umbrella} 
          label="Férias Este Mês" 
          value={mockKPIs.feriasEsteMes}
          subtitle="programadas"
          colorClass="text-warning"
          onClick={() => navigate('/ferias')}
        />
        <KPICard 
          icon={Heart} 
          label="Afastados Hoje" 
          value={mockKPIs.afastadosHoje}
          subtitle="licenças ativas"
          colorClass="text-loggi"
          onClick={() => navigate('/afastamentos')}
        />
        <KPICard 
          icon={Clock} 
          label="Pontos Pendentes" 
          value={mockKPIs.pontosPendentes}
          subtitle="aguardando aprovação"
          colorClass="text-info"
          onClick={() => navigate('/ponto')}
        />
        <KPICard 
          icon={Wallet} 
          label="Folha Projetada" 
          value={formatCurrency(mockKPIs.folhaProjetada)}
          trend={{ value: 3, positive: false }}
          colorClass="text-sales"
          onClick={() => navigate('/folha')}
        />
        <KPICard 
          icon={UserMinus} 
          label="Desligamentos" 
          value={mockKPIs.desligamentosEmCurso}
          subtitle="em andamento"
          colorClass="text-destructive"
          onClick={() => navigate('/desligamento')}
        />
        <KPICard 
          icon={AlertTriangle} 
          label="Alertas Urgentes" 
          value={mockKPIs.alertasUrgentes}
          subtitle="requerem ação"
          colorClass="text-destructive"
        />
      </div>

      {/* Indicadores de DP */}
      <div className="grid md:grid-cols-3 gap-6">
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
            admissoes={dpIndicators.admissoes}
            desligamentos={dpIndicators.desligamentos}
            totalColaboradores={dpIndicators.totalColaboradores}
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
          <AbsenteeismChart data={dpIndicators.absenteeismData} />
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
          <PayrollCostChart data={dpIndicators.payrollCostData} />
        </div>
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
        <AdmissionsLineChart colaboradores={mockColaboradores} months={12} />
      </div>

      {/* Alertas */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Alertas Urgentes
          </h3>
          <AlertsList alertas={mockAlertas.slice(0, 5)} />
        </div>

        {/* Calendar */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            📅 Calendário do Mês
          </h3>
          <MiniCalendar eventos={mockCalendarioEventos} />
        </div>
      </div>
    </div>
  );
}
