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
  BarChart3
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { DepartmentBarChart } from '@/components/dashboard/DepartmentBarChart';
import { StatusPieChart } from '@/components/dashboard/StatusPieChart';
import { MiniCalendar } from '@/components/dashboard/MiniCalendar';
import { mockKPIs, mockAlertas, mockCalendarioEventos, mockColaboradores } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

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

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfico por Departamento */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Colaboradores por Departamento
          </h3>
          <DepartmentBarChart colaboradores={mockColaboradores} />
        </div>

        {/* Gráfico por Status */}
        <div className="p-5 rounded-xl bg-card border border-border relative">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-info" />
            Distribuição por Status
          </h3>
          <StatusPieChart colaboradores={mockColaboradores} />
        </div>
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
