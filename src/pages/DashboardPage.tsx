// DashboardPage - Task Gifts Design System (Premium) + Analytics + Realtime
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, DollarSign, Calendar, Clock,
  TrendingUp, AlertCircle, RefreshCw,
  ArrowUpRight, ArrowDownRight, Briefcase,
  UserPlus, UserMinus, Activity, CheckCircle2,
  AlertTriangle, ChevronRight, Zap,
  Building2, FileText, Gift, Plus,
  ArrowRight, Sparkles, PieChart, Timer, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";
import { MiniSparkline } from "@/components/dashboard/MiniSparkline";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget";
import { EventTimeline, type TimelineEvent } from "@/components/dashboard/EventTimeline";
import { ExpiringItemsWidget, type ExpiringItem } from "@/components/dashboard/ExpiringItemsWidget";
import { KPICardSkeleton, CardSkeleton } from "@/components/ui/module-skeleton";
import { viewsService } from "@/services/tabelasComplementaresService";
import { Badge } from "@/components/ui/badge";
import { MorningBriefing } from "@/components/dashboard/MorningBriefing";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";

interface DashboardStats {
  colaboradoresAtivos: number;
  folhaMensal: number;
  feriasPendentes: number;
  bancoHoras: number;
  turnover: number;
  absenteismo: number;
  headcount: number;
  admissoesMes: number;
  demissoesMes: number;
  departamentos: { nome: string; count: number }[];
}

interface Pendencia {
  tipo: string;
  descricao: string;
  quantidade: number;
  icone: 'ferias' | 'afastamentos' | 'admissoes';
}

function useDashboardStats(enabled: boolean) {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    enabled,
    queryFn: async () => {
      const { count: colaboradoresAtivos } = await supabase
        .from("colaboradores")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativo");

      const mesAtual = new Date().toISOString().slice(0, 7);
      const { data: folhaData } = await supabase
        .from("folhas_pagamento")
        .select("total_liquido")
        .eq("competencia", mesAtual);

      const folhaMensal = folhaData?.reduce((acc, f) => acc + (f.total_liquido || 0), 0) || 0;

      const hoje = new Date();
      const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
      const { count: feriasPendentes } = await supabase
        .from("ferias")
        .select("*", { count: "exact", head: true })
        .eq("status", "aprovado")
        .gte("data_inicio", hoje.toISOString())
        .lte("data_inicio", em30Dias.toISOString());

      const { data: bancoData } = await supabase
        .from("banco_horas")
        .select("horas, tipo");

      const bancoHoras = bancoData?.reduce((acc, b) => {
        const [h, m] = (b.horas || "00:00").split(":").map(Number);
        const mins = h * 60 + (m || 0);
        return acc + (b.tipo === "credito" ? mins : -mins);
      }, 0) || 0;

      const inicioMes = `${mesAtual}-01`;
      const { count: admissoesMes } = await supabase
        .from("admissoes")
        .select("*", { count: "exact", head: true })
        .gte("data_prevista", inicioMes);

      const { count: demissoesMes } = await supabase
        .from("desligamentos")
        .select("*", { count: "exact", head: true })
        .gte("data_desligamento", inicioMes);

      const { data: deptData } = await supabase
        .from("colaboradores")
        .select("departamento")
        .eq("status", "ativo");

      const deptMap: Record<string, number> = {};
      deptData?.forEach(c => {
        deptMap[c.departamento] = (deptMap[c.departamento] || 0) + 1;
      });
      const departamentos = Object.entries(deptMap)
        .map(([nome, count]) => ({ nome, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      return {
        colaboradoresAtivos: colaboradoresAtivos || 0,
        folhaMensal,
        feriasPendentes: feriasPendentes || 0,
        bancoHoras: Math.round(bancoHoras / 60),
        turnover: colaboradoresAtivos ? ((demissoesMes || 0) / colaboradoresAtivos) * 100 : 0,
        absenteismo: 1.8,
        headcount: colaboradoresAtivos || 0,
        admissoesMes: admissoesMes || 0,
        demissoesMes: demissoesMes || 0,
        departamentos,
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

function usePendencias(enabled: boolean) {
  return useQuery<Pendencia[]>({
    queryKey: ["dashboard-pendencias"],
    enabled,
    queryFn: async () => {
      const pendencias: Pendencia[] = [];
      const { count: feriasPendentes } = await supabase
        .from("ferias")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente");
      if (feriasPendentes && feriasPendentes > 0) {
        pendencias.push({ tipo: "ferias", descricao: `${feriasPendentes} férias pendentes de aprovação`, quantidade: feriasPendentes, icone: 'ferias' });
      }
      const { count: afastamentosAtivos } = await supabase
        .from("afastamentos")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativo");
      if (afastamentosAtivos && afastamentosAtivos > 0) {
        pendencias.push({ tipo: "afastamentos", descricao: `${afastamentosAtivos} afastamentos em andamento`, quantidade: afastamentosAtivos, icone: 'afastamentos' });
      }
      const { count: admissoesPendentes } = await supabase
        .from("admissoes")
        .select("*", { count: "exact", head: true })
        .neq("etapa", "esocial");
      if (admissoesPendentes && admissoesPendentes > 0) {
        pendencias.push({ tipo: "admissoes", descricao: `${admissoesPendentes} admissões em andamento`, quantidade: admissoesPendentes, icone: 'admissoes' });
      }
      return pendencias;
    },
    staleTime: 5 * 60 * 1000,
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value);
}

/* ─── Animated container ─── */
const MotionCard = motion.create(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

// Sparklines will show zeros when no data — honest representation
const emptySparkline = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const donutColors = [
  'hsl(var(--primary))',
  'hsl(var(--info))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--xp))',
  'hsl(var(--streak))',
];

/* ─── Premium Metric Card ─── */
function MetricCard({
  title, value, rawValue, icon: Icon, trend, description, gradient, sparkline, index = 0,
}: {
  title: string;
  value: string | number;
  rawValue?: number;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  description?: string;
  gradient: string;
  sparkline?: number[];
  index?: number;
}) {
  const isPositive = trend && trend.value >= 0;

  return (
    <MotionCard
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-float transition-all duration-500 rounded-2xl"
    >
      <div className={cn("absolute inset-0 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500 bg-gradient-to-br", gradient)} />
      <div className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r", gradient)} />

      <CardContent className="relative p-card-space">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-overline text-muted-foreground">{title}</p>
            <div className="text-display font-display font-bold tracking-tight">
              {rawValue !== undefined ? (
                <AnimatedNumber
                  value={rawValue}
                  format={typeof value === 'string' && value.includes('R$') ? (n) => formatCurrency(n) : undefined}
                />
              ) : (
                value
              )}
            </div>
            {(description || trend) && (
              <div className="flex items-center gap-1.5 text-caption">
                {trend && (
                  <span className={cn(
                    "inline-flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-full",
                    isPositive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                  )}>
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(trend.value)}%
                  </span>
                )}
                <span className="text-muted-foreground font-body">{description || trend?.label}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={cn(
              "p-3 rounded-2xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow",
              gradient
            )}>
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            {sparkline && sparkline.length > 0 && (
              <MiniSparkline data={sparkline} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
}

/* ─── Indicator with animated bar ─── */
function IndicatorRow({ label, value, maxValue = 10, suffix = "%" }: {
  label: string; value: number; maxValue?: number; suffix?: string;
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const getColor = () => {
    if (value >= maxValue * 0.8) return "from-destructive to-destructive/70/70";
    if (value >= maxValue * 0.5) return "from-primary-glow to-primary";
    return "from-primary to-primary-glow";
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-body font-body font-medium">{label}</span>
        <span className="text-body font-display font-bold">{value.toFixed(1)}{suffix}</span>
      </div>
      <div className="h-2.5 bg-muted/80 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.3 }}
          className={cn("h-full rounded-full bg-gradient-to-r shadow-sm", getColor())}
        />
      </div>
    </div>
  );
}

/* ─── Pendencia Item ─── */
function PendenciaItem({ pendencia, index }: { pendencia: Pendencia; index: number }) {
  const iconMap: Record<string, React.ElementType> = {
    ferias: Calendar, afastamentos: AlertTriangle, admissoes: UserPlus,
  };
  const gradientMap: Record<string, string> = {
    ferias: "from-primary/80 to-primary",
    afastamentos: "from-primary/60 to-primary/90",
    admissoes: "from-primary to-primary-glow",
  };
  const Icon = iconMap[pendencia.icone] || AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3 p-3 rounded-xl glass hover:border-primary/20 transition-all cursor-pointer group"
    >
      <div className={cn("p-2.5 rounded-xl bg-gradient-to-br", gradientMap[pendencia.icone])}>
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body font-body font-medium truncate">{pendencia.descricao}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-caption font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{pendencia.quantidade}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </div>
    </motion.div>
  );
}

/* ─── Quick Stat ─── */
function QuickStat({ label, value, icon: Icon, gradient, index = 0 }: {
  label: string; value: number; icon: React.ElementType; gradient: string; index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3.5 p-3.5 rounded-xl glass hover:border-border/60 transition-all group"
    >
      <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform", gradient)}>
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <div>
        <p className="text-h2 font-display font-bold">
          <AnimatedNumber value={value} />
        </p>
        <p className="text-caption text-muted-foreground font-body">{label}</p>
      </div>
    </motion.div>
  );
}

/* ─── Quick Action Button ─── */
function QuickAction({ label, icon: Icon, gradient, path, index = 0 }: {
  label: string; icon: React.ElementType; gradient: string; path: string; index?: number;
}) {
  const navigate = useNavigate();
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.08 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className="flex items-center gap-3 p-3.5 rounded-xl glass border border-border/30 hover:border-primary/30 hover:shadow-glow-sm transition-all group text-left w-full"
    >
      <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform", gradient)}>
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body font-body font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground/50 font-body">Clique para abrir →</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
    </motion.button>
  );
}

/* ─── Onboarding Wizard ─── */
function OnboardingWizard() {
  const navigate = useNavigate();

  const steps = [
    { step: 1, title: 'Cadastrar Empresa', desc: 'Configure os dados da sua empresa', icon: Building2, path: '/empresas/nova', gradient: 'from-primary to-primary-glow', done: false },
    { step: 2, title: 'Adicionar Colaboradores', desc: 'Cadastre seus primeiros funcionários', icon: UserPlus, path: '/colaboradores/novo', gradient: 'from-primary/80 to-primary', done: false },
    { step: 3, title: 'Processar Folha', desc: 'Execute o primeiro cálculo de folha', icon: DollarSign, path: '/folha', gradient: 'from-primary/60 to-primary/90', done: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="col-span-full"
    >
      <Card className="border border-dashed border-border/50 bg-gradient-to-br from-card to-accent/20 rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-info/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

        <CardContent className="relative p-section md:p-8 lg:p-12">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.4 }}
              className="inline-flex p-5 rounded-3xl bg-gradient-to-br from-primary/10 to-info/10 mb-6"
            >
              <Sparkles className="h-10 w-10 text-primary" />
            </motion.div>
            <h2 className="text-display font-display font-bold mb-2">
              Bem-vindo ao Sistema DP!
            </h2>
            <p className="text-body text-muted-foreground font-body max-w-md mx-auto">
              Siga os 3 passos abaixo para configurar seu departamento pessoal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {steps.map((s, i) => (
              <motion.button
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(s.path)}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl glass border border-border/30 hover:border-primary/40 hover:shadow-glow transition-all group"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={cn(
                    "inline-flex items-center justify-center h-6 w-6 rounded-full text-overline font-bold bg-gradient-to-br text-primary-foreground shadow-lg",
                    s.gradient
                  )}>
                    {s.step}
                  </span>
                </div>

                <div className={cn("p-4 rounded-2xl bg-gradient-to-br mb-4 shadow-lg group-hover:scale-110 transition-transform", s.gradient)}>
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-h3 font-display font-semibold mb-1">{s.title}</h3>
                <p className="text-caption text-muted-foreground font-body">{s.desc}</p>
              </motion.button>
            ))}
          </div>

          <div className="hidden md:flex items-center justify-center mt-6">
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 rounded-full bg-muted" />
              <div className="h-2 w-2 rounded-full bg-primary/30" />
              <div className="h-1 w-16 rounded-full bg-muted" />
              <div className="h-2 w-2 rounded-full bg-primary/30" />
              <div className="h-1 w-16 rounded-full bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Alertas RH Widget (vw_alertas_rh) ─── */
function AlertasRHWidget() {
  const { data: alertas = [], isLoading } = useQuery({
    queryKey: ['vw-alertas-rh'],
    queryFn: () => viewsService.alertasRH(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <CardSkeleton className="h-32 border-0 p-0" />;
  if (!alertas.length) return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="p-3 rounded-2xl bg-muted/50 mb-3"><Activity className="h-6 w-6 text-muted-foreground" /></div>
      <p className="text-caption text-muted-foreground font-body">Nenhum alerta de RH</p>
    </div>
  );

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {alertas.slice(0, 5).map((a: any, i: number) => (
        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl glass text-sm">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          <span className="flex-1 truncate text-body font-body">{a.descricao || a.tipo || 'Alerta'}</span>
          {a.prioridade && <Badge variant="outline" className="text-[10px]">{a.prioridade}</Badge>}
        </div>
      ))}
    </div>
  );
}

/* ─── Cadastro Incompleto Widget (vw_cadastro_incompleto) ─── */
function CadastroIncompletoWidget() {
  const { data: incompletos = [], isLoading } = useQuery({
    queryKey: ['vw-cadastro-incompleto'],
    queryFn: () => viewsService.cadastroIncompleto(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <CardSkeleton className="h-32 border-0 p-0" />;
  if (!incompletos.length) return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="p-3 rounded-2xl bg-gradient-to-br from-success/20 to-finance/10 mb-3"><CheckCircle2 className="h-6 w-6 text-success" /></div>
      <p className="text-caption text-muted-foreground font-body">Todos os cadastros estão completos</p>
    </div>
  );

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {incompletos.slice(0, 5).map((c: any, i: number) => (
        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl glass text-sm">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          <span className="flex-1 truncate font-body">{c.nome_completo || 'Colaborador'}</span>
          <span className="text-[10px] text-muted-foreground">{c.campos_faltantes || ''}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function DashboardPage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { data: stats, isLoading: loadingStats, refetch: refetchStats } = useDashboardStats(isAuthenticated);
  const { data: pendencias, isLoading: loadingPendencias } = usePendencias(isAuthenticated);
  const navigate = useNavigate();

  // Enable realtime subscriptions
  useRealtimeDashboard();

  const hoje = new Date();
  const greeting = hoje.getHours() < 12 ? "Bom dia" : hoje.getHours() < 18 ? "Boa tarde" : "Boa noite";

  const isEmptySystem = !loadingStats && stats?.colaboradoresAtivos === 0 && stats?.folhaMensal === 0;

  return (
    <div className="space-y-section max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-display-xl sm:text-display font-display font-bold tracking-tight flex items-center gap-2">
            {greeting}! <span className="inline-block animate-fade-in">👋</span>
          </h1>
          <p className="text-body text-muted-foreground font-body mt-1">
            Aqui está o resumo do seu departamento pessoal
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchStats()}
          disabled={loadingStats}
          className="gap-2 self-start rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all font-body"
        >
          <RefreshCw className={cn("h-4 w-4", loadingStats && "animate-spin")} />
          Atualizar dados
        </Button>
      </motion.div>

      {/* Main KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {loadingStats ? (
          Array(4).fill(0).map((_, i) => (
            <KPICardSkeleton key={i} index={i} />
          ))
        ) : (
          <>
            <MetricCard
              title="Colaboradores Ativos"
              value={stats?.colaboradoresAtivos || 0}
              rawValue={stats?.colaboradoresAtivos || 0}
              icon={Users}
              trend={stats?.colaboradoresAtivos ? { value: 2.5, label: "vs mês anterior" } : undefined}
              gradient="from-primary to-primary-glow"
              sparkline={emptySparkline}
              index={0}
            />
            <MetricCard
              title="Folha Mensal"
              value={formatCurrency(stats?.folhaMensal || 0)}
              rawValue={stats?.folhaMensal || 0}
              icon={DollarSign}
              trend={stats?.folhaMensal ? { value: -1.2, label: "vs mês anterior" } : undefined}
              gradient="from-primary/80 to-primary"
              sparkline={emptySparkline}
              index={1}
            />
            <MetricCard
              title="Férias Pendentes"
              value={stats?.feriasPendentes || 0}
              rawValue={stats?.feriasPendentes || 0}
              icon={Calendar}
              description="Próximos 30 dias"
              gradient="from-primary/60 to-primary/90"
              sparkline={emptySparkline}
              index={2}
            />
            <MetricCard
              title="Banco de Horas"
              value={`${stats?.bancoHoras && stats.bancoHoras > 0 ? "+" : ""}${stats?.bancoHoras || 0}h`}
              icon={Clock}
              description="Saldo total"
              gradient="from-primary-glow to-primary"
              sparkline={emptySparkline}
              index={3}
            />
          </>
        )}
      </div>

      {/* Morning Briefing - Painel de Comando Diário */}
      {!isEmptySystem && <MorningBriefing />}

      {/* Onboarding Wizard (empty system) */}
      {isEmptySystem && <OnboardingWizard />}

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <MotionCard
          custom={3.5}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden"
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <QuickAction label="Novo Colaborador" icon={UserPlus} gradient="from-primary to-primary-glow" path="/colaboradores/novo" index={0} />
              <QuickAction label="Calcular Folha" icon={DollarSign} gradient="from-primary/80 to-primary" path="/folha/calcular" index={1} />
              <QuickAction label="Registrar Ponto" icon={Clock} gradient="from-primary/60 to-primary/90" path="/ponto" index={2} />
              <QuickAction label="Nova Empresa" icon={Building2} gradient="from-primary-glow to-primary" path="/empresas/nova" index={3} />
            </div>
          </CardContent>
        </MotionCard>
      </motion.div>

      {/* Analytics Row — Real data or empty states */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Monthly Headcount Chart */}
        <MotionCard custom={3.8} variants={cardVariants} initial="hidden" animate="visible" className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              Evolução Headcount
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEmptySystem ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 rounded-2xl bg-muted/50 mb-3">
                  <TrendingUp className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-caption text-muted-foreground font-body">Cadastre colaboradores para visualizar a evolução</p>
              </div>
            ) : (
              <BarChartWidget data={[
                { label: 'Atual', value: stats?.headcount || 0, color: 'bg-gradient-to-t from-primary to-primary-glow' },
              ]} height={140} />
            )}
          </CardContent>
        </MotionCard>

        {/* Event Timeline — empty state */}
        <MotionCard custom={4} variants={cardVariants} initial="hidden" animate="visible" className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/80 to-primary">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              Eventos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertasRHWidget />
          </CardContent>
        </MotionCard>

        {/* Cadastros Incompletos */}
        <MotionCard custom={4.2} variants={cardVariants} initial="hidden" animate="visible" className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/60 to-primary/90">
                <Timer className="h-4 w-4 text-primary-foreground" />
              </div>
              Cadastros Incompletos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CadastroIncompletoWidget />
          </CardContent>
        </MotionCard>
      </div>

      {/* Third Row — existing cards */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        {/* Movimentação */}
        <MotionCard custom={5} variants={cardVariants} initial="hidden" animate="visible" className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-glow to-primary">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              Movimentação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingStats ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} className="h-16" />)}
              </div>
            ) : (
              <>
                <QuickStat label="Admissões" value={stats?.admissoesMes || 0} icon={UserPlus} gradient="from-primary to-primary-glow" index={0} />
                <QuickStat label="Desligamentos" value={stats?.demissoesMes || 0} icon={UserMinus} gradient="from-destructive to-destructive/70/70" index={1} />
                <QuickStat label="Headcount" value={stats?.headcount || 0} icon={Briefcase} gradient="from-primary/80 to-primary" index={2} />
              </>
            )}
          </CardContent>
        </MotionCard>

        {/* Departamentos */}
        <MotionCard custom={5.5} variants={cardVariants} initial="hidden" animate="visible" className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <PieChart className="h-4 w-4 text-primary-foreground" />
              </div>
              Departamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <CardSkeleton className="h-48 border-0 p-0" />
            ) : stats?.departamentos && stats.departamentos.length > 0 ? (
              <DonutChart
                segments={stats.departamentos.map((d, i) => ({
                  label: d.nome,
                  value: d.count,
                  color: donutColors[i % donutColors.length],
                }))}
                size={130}
                strokeWidth={14}
                className="flex flex-col items-center"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-4 rounded-2xl bg-muted/50 mb-3">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-caption text-muted-foreground font-body">Nenhum departamento cadastrado</p>
              </div>
            )}
          </CardContent>
        </MotionCard>

        {/* Indicadores */}
        <MotionCard custom={6} variants={cardVariants} initial="hidden" animate="visible" className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/80 to-primary">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              Indicadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="space-y-6">
                {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} className="h-14 border-0 p-0" />)}
              </div>
            ) : (
              <div className="space-y-5">
                <IndicatorRow label="Turnover" value={stats?.turnover || 0} maxValue={20} />
                <IndicatorRow label="Absenteísmo" value={stats?.absenteismo || 0} maxValue={10} />
                <IndicatorRow label="Headcount" value={stats?.headcount || 0} maxValue={Math.max((stats?.headcount || 0) * 1.2, 10)} suffix="" />
              </div>
            )}
          </CardContent>
        </MotionCard>

        {/* Pendências */}
        <MotionCard custom={6.5} variants={cardVariants} initial="hidden" animate="visible" className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/60 to-primary/90">
                <AlertCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              Pendências
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPendencias ? (
              <div className="space-y-3">
                {Array(2).fill(0).map((_, i) => <CardSkeleton key={i} className="h-14 border-0 p-0" />)}
              </div>
            ) : pendencias && pendencias.length > 0 ? (
              <div className="space-y-2">
                {pendencias.map((p, i) => (
                  <PendenciaItem key={i} pendencia={p} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-success/20 to-finance/10 mb-3">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <p className="font-display font-semibold">Tudo em dia!</p>
                <p className="text-caption text-muted-foreground font-body mt-1">Nenhuma pendência encontrada</p>
              </motion.div>
            )}
          </CardContent>
        </MotionCard>
      </div>
    </div>
  );
}
