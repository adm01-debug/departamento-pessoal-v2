import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useMemo } from 'react';
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
import { subMonths, subQuarters, subYears, isAfter, parseISO, differenceInDays, addDays, format } from 'date-fns';
import { useColaboradores } from '@/hooks/useColaboradores';
import { useIndicadoresDP } from '@/hooks/useIndicadoresDP';

type PeriodFilter = 'all' | 'month' | 'quarter' | 'year';

const periodLabels: Record<PeriodFilter, string> = {
  all: 'Todo período',
  month: 'Último mês',
  quarter: 'Último trimestre',
  year: 'Último ano',
};

// Tipos para alertas e eventos
interface Alerta {
  id: string;
  tipo: 'warning' | 'error' | 'info';
  titulo: string;
  descricao: string;
  data?: string;
}

interface EventoCalendario {
  id: string;
  titulo: string;
  data: Date;
  tipo: 'ferias' | 'admissao' | 'desligamento' | 'aniversario' | 'feriado';
}

const Dashboard = memo(function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard | DP System';
  }, []);

  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodFilter>('year');
  
  // ✅ FIX: Chamar useColaboradores corretamente
  const { colaboradores, loading: loadingColaboradores } = useColaboradores();
  
  // Hook para indicadores de DP com dados reais
  const indicadoresPeriodo = period === 'all' ? 'year' : period;
  const indicadores = useIndicadoresDP(indicadoresPeriodo as 'month' | 'quarter' | 'year');

  // ✅ FIX: Gerar alertas baseados em dados reais
  const alertasData = useMemo<Alerta[]>(() => {
    const alertas: Alerta[] = [];
    const hoje = new Date();
    
    // Alertas de documentos vencendo
    colaboradores.forEach(c => {
      if (c.cnh_validade) {
        const vencimento = parseISO(c.cnh_validade);
        const diasParaVencer = differenceInDays(vencimento, hoje);
        if (diasParaVencer > 0 && diasParaVencer <= 30) {
          alertas.push({
            id: `cnh-${c.id}`,
            tipo: 'warning',
            titulo: 'CNH Vencendo',
            descricao: `CNH de ${c.nome_completo} vence em ${diasParaVencer} dias`,
            data: c.cnh_validade,
          });
        } else if (diasParaVencer <= 0) {
          alertas.push({
            id: `cnh-vencida-${c.id}`,
            tipo: 'error',
            titulo: 'CNH Vencida',
            descricao: `CNH de ${c.nome_completo} está vencida`,
            data: c.cnh_validade,
          });
        }
      }
      
      // Alertas de férias vencendo (> 11 meses sem férias)
      if (c.data_admissao && c.status === 'ativo') {
        const admissao = parseISO(c.data_admissao);
        const mesesDesdeAdmissao = differenceInDays(hoje, admissao) / 30;
        if (mesesDesdeAdmissao > 22) { // 22 meses = período concessivo vencendo
          alertas.push({
            id: `ferias-${c.id}`,
            tipo: 'error',
            titulo: 'Férias Vencendo',
            descricao: `${c.nome_completo} precisa tirar férias urgente`,
          });
        } else if (mesesDesdeAdmissao > 11 && mesesDesdeAdmissao <= 22) {
          alertas.push({
            id: `ferias-prox-${c.id}`,
            tipo: 'warning',
            titulo: 'Férias Disponíveis',
            descricao: `${c.nome_completo} tem férias a programar`,
          });
        }
      }
    });
    
    // Limitar e ordenar por prioridade
    return alertas
      .sort((a, b) => (a.tipo === 'error' ? -1 : 1) - (b.tipo === 'error' ? -1 : 1))
      .slice(0, 10);
  }, [colaboradores]);

  // ✅ FIX: Gerar eventos do calendário baseados em dados reais
  const eventosCalendario = useMemo<EventoCalendario[]>(() => {
    const eventos: EventoCalendario[] = [];
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    colaboradores.forEach(c => {
      // Aniversários no mês
      if (c.data_nascimento) {
        const nascimento = parseISO(c.data_nascimento);
        const aniversarioEsteMes = new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate());
        if (aniversarioEsteMes >= inicioMes && aniversarioEsteMes <= fimMes) {
          eventos.push({
            id: `aniv-${c.id}`,
            titulo: `🎂 ${c.nome_completo.split(' ')[0]}`,
            data: aniversarioEsteMes,
            tipo: 'aniversario',
          });
        }
      }
      
      // Admissões recentes (últimos 30 dias)
      if (c.data_admissao) {
        const admissao = parseISO(c.data_admissao);
        if (differenceInDays(hoje, admissao) <= 30 && differenceInDays(hoje, admissao) >= 0) {
          eventos.push({
            id: `adm-${c.id}`,
            titulo: `✨ Admissão: ${c.nome_completo.split(' ')[0]}`,
            data: admissao,
            tipo: 'admissao',
          });
        }
      }
    });
    
    return eventos.sort((a, b) => a.data.getTime() - b.data.getTime());
  }, [colaboradores]);

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

  // ✅ FIX: Usar colaboradores do hook ao invés de colaboradoresData
  const filteredColaboradores = useMemo(() => {
    if (period === 'all') return colaboradores;

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
        return colaboradores;
    }

    return colaboradores.filter(c => 
      c.data_admissao && isAfter(new Date(c.data_admissao), startDate)
    );
  }, [colaboradores, period]);

  // Loading state
  const isLoading = loadingColaboradores || indicadores.loading;

  return (
    <>
    <SEOHead title="Dashboard | DP System" description="Visão geral do Departamento Pessoal" />
    <div id="main-content" className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral do Departamento Pessoal</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
          {isLoading ? (
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
          value={alertasData.filter(a => a.tipo === 'error').length}
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
        <AdmissionsLineChart colaboradores={colaboradores} months={12} />
      </div>

      {/* Alertas e Calendário */}
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
    </>
  );
});

export default Dashboard;
