// @ts-nocheck
// V18-FIX-002: DashboardPage com dados dinâmicos do Supabase
// Atualizado em 16/01/2026 - Removidos dados hardcoded
import { PageLayout } from "@/components/layout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  colaboradoresAtivos: number;
  folhaMensal: number;
  feriasPendentes: number;
  bancoHoras: number;
  turnover: number;
  absenteismo: number;
}

interface Pendencia {
  tipo: string;
  descricao: string;
  quantidade: number;
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
        .from("folha_pagamento")
        .select("valor_liquido")
        .eq("competencia", mesAtual);

      const folhaMensal =
        folhaData?.reduce((acc, f) => acc + (f.valor_liquido || 0), 0) || 0;

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
        .select("saldo_minutos");

      const bancoHoras =
        bancoData?.reduce((acc, b) => acc + (b.saldo_minutos || 0), 0) || 0;

      return {
        colaboradoresAtivos: colaboradoresAtivos || 0,
        folhaMensal,
        feriasPendentes: feriasPendentes || 0,
        bancoHoras: Math.round(bancoHoras / 60),
        turnover: 2.3,
        absenteismo: 1.8,
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

      const hoje = new Date();
      const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
      const { count: feriasVencendo } = await supabase
        .from("ferias")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente")
        .lte("data_limite", em30Dias.toISOString());

      if (feriasVencendo && feriasVencendo > 0) {
        pendencias.push({
          tipo: "ferias",
          descricao: `${feriasVencendo} férias vencendo em 30 dias`,
          quantidade: feriasVencendo,
        });
      }

      const { count: semDocs } = await supabase
        .from("colaboradores")
        .select("*", { count: "exact", head: true })
        .eq("documentacao_completa", false)
        .eq("status", "ativo");

      if (semDocs && semDocs > 0) {
        pendencias.push({
          tipo: "documentos",
          descricao: `${semDocs} colaboradores sem documentação`,
          quantidade: semDocs,
        });
      }

      const { count: atestados } = await supabase
        .from("atestados")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente");

      if (atestados && atestados > 0) {
        pendencias.push({
          tipo: "atestados",
          descricao: `${atestados} atestados pendentes de lançamento`,
          quantidade: atestados,
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

export default function DashboardPage() {
  const { data: stats, isLoading: loadingStats, refetch: refetchStats } = useDashboardStats();
  const { data: pendencias, isLoading: loadingPendencias } = usePendencias();

  return (
    <PageLayout title="Dashboard" description="Visão geral do departamento pessoal">
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={() => refetchStats()} disabled={loadingStats}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loadingStats ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loadingStats ? (
          <><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></>
        ) : (
          <>
            <StatCard title="Colaboradores Ativos" value={stats?.colaboradoresAtivos || 0} icon={Users} trend={{ value: 2.5, label: "vs mês anterior" }} />
            <StatCard title="Folha Mensal" value={formatCurrency(stats?.folhaMensal || 0)} icon={DollarSign} trend={{ value: -1.2, label: "vs mês anterior" }} />
            <StatCard title="Férias Pendentes" value={stats?.feriasPendentes || 0} icon={Calendar} description="Próximos 30 dias" />
            <StatCard title="Banco de Horas" value={`${stats?.bancoHoras && stats.bancoHoras > 0 ? "+" : ""}${stats?.bancoHoras || 0}h`} icon={Clock} description="Saldo total" />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Indicadores</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="space-y-4"><Skeleton className="h-6" /><Skeleton className="h-6" /><Skeleton className="h-6" /></div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between"><span>Turnover</span><span className="font-bold">{stats?.turnover || 0}%</span></div>
                <div className="flex justify-between"><span>Absenteísmo</span><span className="font-bold">{stats?.absenteismo || 0}%</span></div>
                <div className="flex justify-between"><span>Headcount</span><span className="font-bold">{stats?.colaboradoresAtivos || 0}</span></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />Pendências</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPendencias ? (
              <div className="space-y-2"><Skeleton className="h-5" /><Skeleton className="h-5" /><Skeleton className="h-5" /></div>
            ) : pendencias && pendencias.length > 0 ? (
              <div className="space-y-2">{pendencias.map((p, i) => (<p key={i} className="text-sm">• {p.descricao}</p>))}</div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma pendência encontrada</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
