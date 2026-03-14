// DashboardPage - Premium HR Dashboard
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  UserPlus,
  UserMinus,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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
        pendencias.push({
          tipo: "ferias",
          descricao: `${feriasPendentes} férias pendentes de aprovação`,
          quantidade: feriasPendentes,
          icone: 'ferias',
        });
      }

      const { count: afastamentosAtivos } = await supabase
        .from("afastamentos")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativo");

      if (afastamentosAtivos && afastamentosAtivos > 0) {
        pendencias.push({
          tipo: "afastamentos",
          descricao: `${afastamentosAtivos} afastamentos em andamento`,
          quantidade: afastamentosAtivos,
          icone: 'afastamentos',
        });
      }

      const { count: admissoesPendentes } = await supabase
        .from("admissoes")
        .select("*", { count: "exact", head: true })
        .neq("etapa", "esocial");

      if (admissoesPendentes && admissoesPendentes > 0) {
        pendencias.push({
          tipo: "admissoes",
          descricao: `${admissoesPendentes} admissões em andamento`,
          quantidade: admissoesPendentes,
          icone: 'admissoes',
        });
      }

      return pendencias;
    },
    staleTime: 5 * 60 * 1000,
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/* ─── Metric Card ─── */
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  accentColor = "primary",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  description?: string;
  accentColor?: "primary" | "success" | "warning" | "destructive" | "info";
}) {
  const colorMap: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 text-primary",
    success: "from-green-500/10 to-green-500/5 text-green-600",
    warning: "from-amber-500/10 to-amber-500/5 text-amber-600",
    destructive: "from-red-500/10 to-red-500/5 text-red-600",
    info: "from-blue-500/10 to-blue-500/5 text-blue-600",
  };

  const iconBg: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600",
    warning: "bg-amber-500/10 text-amber-600",
    destructive: "bg-red-500/10 text-red-600",
    info: "bg-blue-500/10 text-blue-600",
  };

  const isPositive = trend && trend.value >= 0;

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", colorMap[accentColor])} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {(description || trend) && (
              <div className="flex items-center gap-1.5 text-xs">
                {trend && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded-full",
                      isPositive
                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(trend.value)}%
                  </span>
                )}
                <span className="text-muted-foreground">
                  {description || trend?.label}
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-xl transition-transform group-hover:scale-110",
              iconBg[accentColor]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Indicator Row ─── */
function IndicatorRow({
  label,
  value,
  maxValue = 10,
  color = "primary",
  suffix = "%",
}: {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  suffix?: string;
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const getColor = () => {
    if (value >= maxValue * 0.8) return "bg-red-500";
    if (value >= maxValue * 0.5) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold tabular-nums">
          {value.toFixed(1)}{suffix}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Pendencia Item ─── */
function PendenciaItem({ pendencia }: { pendencia: Pendencia }) {
  const iconMap: Record<string, React.ElementType> = {
    ferias: Calendar,
    afastamentos: AlertTriangle,
    admissoes: UserPlus,
  };
  const colorMap: Record<string, string> = {
    ferias: "bg-blue-500/10 text-blue-600",
    afastamentos: "bg-amber-500/10 text-amber-600",
    admissoes: "bg-green-500/10 text-green-600",
  };

  const Icon = iconMap[pendencia.icone] || AlertCircle;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
      <div className={cn("p-2 rounded-lg", colorMap[pendencia.icone])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{pendencia.descricao}</p>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
          {pendencia.quantidade}
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

/* ─── Quick Stat ─── */
function QuickStat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function DashboardPage() {
  const {
    data: stats,
    isLoading: loadingStats,
    refetch: refetchStats,
  } = useDashboardStats();
  const { data: pendencias, isLoading: loadingPendencias } = usePendencias();

  const hoje = new Date();
  const greeting = hoje.getHours() < 12 ? "Bom dia" : hoje.getHours() < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{greeting}! 👋</h1>
          <p className="text-muted-foreground">
            Aqui está o resumo do seu departamento pessoal
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchStats()}
          disabled={loadingStats}
          className="gap-2 self-start"
        >
          <RefreshCw
            className={cn("h-4 w-4", loadingStats && "animate-spin")}
          />
          Atualizar dados
        </Button>
      </div>

      {/* Main KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {loadingStats ? (
          <>
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[130px] rounded-xl" />
              ))}
          </>
        ) : (
          <>
            <MetricCard
              title="Colaboradores Ativos"
              value={stats?.colaboradoresAtivos || 0}
              icon={Users}
              trend={{ value: 2.5, label: "vs mês anterior" }}
              accentColor="primary"
            />
            <MetricCard
              title="Folha Mensal"
              value={formatCurrency(stats?.folhaMensal || 0)}
              icon={DollarSign}
              trend={{ value: -1.2, label: "vs mês anterior" }}
              accentColor="info"
            />
            <MetricCard
              title="Férias Pendentes"
              value={stats?.feriasPendentes || 0}
              icon={Calendar}
              description="Próximos 30 dias"
              accentColor="warning"
            />
            <MetricCard
              title="Banco de Horas"
              value={`${stats?.bancoHoras && stats.bancoHoras > 0 ? "+" : ""}${stats?.bancoHoras || 0}h`}
              icon={Clock}
              description="Saldo total"
              accentColor="success"
            />
          </>
        )}
      </div>

      {/* Second Row - Movimentação + Indicadores + Pendências */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Movimentação */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5 text-primary" />
              Movimentação do Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingStats ? (
              <div className="space-y-3">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : (
              <>
                <QuickStat
                  label="Admissões"
                  value={stats?.admissoesMes || 0}
                  icon={UserPlus}
                  color="bg-green-500/10 text-green-600"
                />
                <QuickStat
                  label="Desligamentos"
                  value={stats?.demissoesMes || 0}
                  icon={UserMinus}
                  color="bg-red-500/10 text-red-600"
                />
                <QuickStat
                  label="Headcount"
                  value={stats?.headcount || 0}
                  icon={Briefcase}
                  color="bg-primary/10 text-primary"
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Indicadores */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Indicadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="space-y-6">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : (
              <div className="space-y-5">
                <IndicatorRow
                  label="Turnover"
                  value={stats?.turnover || 0}
                  maxValue={20}
                />
                <IndicatorRow
                  label="Absenteísmo"
                  value={stats?.absenteismo || 0}
                  maxValue={10}
                />
                <IndicatorRow
                  label="Headcount"
                  value={stats?.headcount || 0}
                  maxValue={Math.max((stats?.headcount || 0) * 1.2, 10)}
                  suffix=""
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pendências */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-5 w-5 text-primary" />
              Pendências
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPendencias ? (
              <div className="space-y-3">
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            ) : pendencias && pendencias.length > 0 ? (
              <div className="space-y-2">
                {pendencias.map((p, i) => (
                  <PendenciaItem key={i} pendencia={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 rounded-full bg-green-500/10 mb-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="font-medium">Tudo em dia!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Nenhuma pendência encontrada
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
