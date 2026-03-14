// DashboardPage - Task Gifts Design System
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users, DollarSign, Calendar, Clock,
  TrendingUp, AlertCircle, RefreshCw,
  ArrowUpRight, ArrowDownRight, Briefcase,
  UserPlus, UserMinus, Activity, CheckCircle2,
  AlertTriangle, ChevronRight, Zap,
  Building2, FileText, Gift, Plus,
  ArrowRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
}

interface Pendencia {
  tipo: string;
  descricao: string;
  quantidade: number;
  icone: 'ferias' | 'afastamentos' | 'admissoes';
}

function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
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

      const folhaMensal =
        folhaData?.reduce((acc, f) => acc + (f.total_liquido || 0), 0) || 0;

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

      const bancoHoras =
        bancoData?.reduce((acc, b) => {
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
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

function usePendencias() {
  return useQuery<Pendencia[]>({
    queryKey: ["dashboard-pendencias"],
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

/* ─── Premium Metric Card ─── */
function MetricCard({
  title, value, icon: Icon, trend, description, gradient, index = 0,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  description?: string;
  gradient: string;
  index?: number;
}) {
  const isPositive = trend && trend.value >= 0;

  return (
    <MotionCard
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group relative overflow-hidden border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-500 rounded-2xl"
    >
      <div className={cn("absolute inset-0 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500 bg-gradient-to-br", gradient)} />
      <div className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r", gradient)} />

      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-display font-bold tracking-tight">{value}</p>
            {(description || trend) && (
              <div className="flex items-center gap-1.5 text-xs">
                {trend && (
                  <span className={cn(
                    "inline-flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-full text-[11px]",
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
          <div className={cn(
            "p-3 rounded-2xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow",
            gradient
          )}>
            <Icon className="h-5 w-5 text-primary-foreground" />
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
    if (value >= maxValue * 0.8) return "from-destructive to-destructive/70";
    if (value >= maxValue * 0.5) return "from-warning to-coins";
    return "from-success to-finance";
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-body font-medium">{label}</span>
        <span className="text-sm font-display font-bold tabular-nums">{value.toFixed(1)}{suffix}</span>
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
    ferias: "from-info to-level",
    afastamentos: "from-warning to-coins",
    admissoes: "from-success to-finance",
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
        <p className="text-sm font-body font-medium truncate">{pendencia.descricao}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{pendencia.quantidade}</span>
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
        <p className="text-xl font-display font-bold">{value}</p>
        <p className="text-xs text-muted-foreground font-body">{label}</p>
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
        <p className="text-sm font-body font-medium">{label}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
    </motion.button>
  );
}

/* ─── Empty State ─── */
function EmptyState() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="col-span-full"
    >
      <Card className="border border-dashed border-border/50 bg-gradient-to-br from-card to-accent/20 rounded-2xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-info/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

        <CardContent className="relative p-8 md:p-12">
          <div className="max-w-lg mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.4 }}
              className="inline-flex p-5 rounded-3xl bg-gradient-to-br from-primary/10 to-info/10 mb-6"
            >
              <Sparkles className="h-10 w-10 text-primary" />
            </motion.div>

            <h2 className="text-2xl font-display font-bold mb-2">
              Comece configurando seu sistema!
            </h2>
            <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">
              Cadastre sua empresa e seus primeiros colaboradores para começar a usar todas as funcionalidades.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              <Button
                onClick={() => navigate('/empresas/nova')}
                className="gap-2 h-12 rounded-xl bg-gradient-to-r from-xp to-tasks hover:opacity-90 transition-opacity font-body"
              >
                <Building2 className="h-4 w-4" />
                Cadastrar Empresa
              </Button>
              <Button
                onClick={() => navigate('/colaboradores/novo')}
                variant="outline"
                className="gap-2 h-12 rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5 font-body"
              >
                <UserPlus className="h-4 w-4" />
                Novo Colaborador
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Main Dashboard ─── */
export default function DashboardPage() {
  const { data: stats, isLoading: loadingStats, refetch: refetchStats } = useDashboardStats();
  const { data: pendencias, isLoading: loadingPendencias } = usePendencias();
  const navigate = useNavigate();

  const hoje = new Date();
  const greeting = hoje.getHours() < 12 ? "Bom dia" : hoje.getHours() < 18 ? "Boa tarde" : "Boa noite";

  const isEmptySystem = !loadingStats && stats?.colaboradoresAtivos === 0 && stats?.folhaMensal === 0;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight flex items-center gap-2">
            {greeting}! <span className="inline-block animate-fade-in">👋</span>
          </h1>
          <p className="text-muted-foreground font-body mt-1">
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
            <Skeleton key={i} className="h-[140px] rounded-2xl" />
          ))
        ) : (
          <>
            <MetricCard title="Colaboradores Ativos" value={stats?.colaboradoresAtivos || 0} icon={Users} trend={{ value: 2.5, label: "vs mês anterior" }} gradient="from-primary to-primary-glow" index={0} />
            <MetricCard title="Folha Mensal" value={formatCurrency(stats?.folhaMensal || 0)} icon={DollarSign} trend={{ value: -1.2, label: "vs mês anterior" }} gradient="from-info to-level" index={1} />
            <MetricCard title="Férias Pendentes" value={stats?.feriasPendentes || 0} icon={Calendar} description="Próximos 30 dias" gradient="from-warning to-coins" index={2} />
            <MetricCard title="Banco de Horas" value={`${stats?.bancoHoras && stats.bancoHoras > 0 ? "+" : ""}${stats?.bancoHoras || 0}h`} icon={Clock} description="Saldo total" gradient="from-success to-finance" index={3} />
          </>
        )}
      </div>

      {/* Empty State CTA */}
      {isEmptySystem && <EmptyState />}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <MotionCard
          custom={3.5}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden"
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <QuickAction label="Novo Colaborador" icon={UserPlus} gradient="from-success to-finance" path="/colaboradores/novo" index={0} />
              <QuickAction label="Calcular Folha" icon={DollarSign} gradient="from-info to-level" path="/folha/calcular" index={1} />
              <QuickAction label="Registrar Ponto" icon={Clock} gradient="from-streak to-warning" path="/ponto" index={2} />
              <QuickAction label="Nova Empresa" icon={Building2} gradient="from-xp to-tasks" path="/empresas/nova" index={3} />
            </div>
          </CardContent>
        </MotionCard>
      </motion.div>

      {/* Second Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Movimentação */}
        <MotionCard custom={4} variants={cardVariants} initial="hidden" animate="visible" className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-xp to-tasks">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              Movimentação do Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingStats ? (
              <div className="space-y-3">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </div>
            ) : (
              <>
                <QuickStat label="Admissões" value={stats?.admissoesMes || 0} icon={UserPlus} gradient="from-success to-finance" index={0} />
                <QuickStat label="Desligamentos" value={stats?.demissoesMes || 0} icon={UserMinus} gradient="from-destructive to-streak" index={1} />
                <QuickStat label="Headcount" value={stats?.headcount || 0} icon={Briefcase} gradient="from-primary to-primary-glow" index={2} />
              </>
            )}
          </CardContent>
        </MotionCard>

        {/* Indicadores */}
        <MotionCard custom={5} variants={cardVariants} initial="hidden" animate="visible" className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-info to-level">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              Indicadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="space-y-6">
                <Skeleton className="h-14 rounded-xl" />
                <Skeleton className="h-14 rounded-xl" />
                <Skeleton className="h-14 rounded-xl" />
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
        <MotionCard custom={6} variants={cardVariants} initial="hidden" animate="visible" className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-warning to-coins">
                <AlertCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              Pendências
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPendencias ? (
              <div className="space-y-3">
                <Skeleton className="h-14 rounded-xl" />
                <Skeleton className="h-14 rounded-xl" />
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
                <p className="text-sm text-muted-foreground font-body mt-1">Nenhuma pendência encontrada</p>
              </motion.div>
            )}
          </CardContent>
        </MotionCard>
      </div>
    </div>
  );
}
