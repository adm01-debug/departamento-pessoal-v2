import { PageTitle } from '@/components/PageTitle';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Activity, GitBranch, ShieldAlert, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DlqRow { tipo_tarefa: string; total_dlq: number; mais_recente: string | null; ultimo_erro_sample: string | null }
interface ConflictRow { competencia: string; conflitos: number; ultimo_em: string }
interface TelemetryRow { query_sample: string; calls: number; mean_ms: number; max_ms: number; total_ms: number; cache_hit_pct: number }
interface IdemRow { endpoint: string; total_24h: number; failed_24h: number; failure_rate_pct: number; last_seen_at: string }
interface CronRow { jobname: string; schedule: string; active: boolean; last_run: string | null; last_status: string | null; last_duration_ms: number | null; last_error: string | null; runs_24h: number; failures_24h: number }

function SectionCard({ title, icon: Icon, children, badge }: { title: string; icon: any; children: React.ReactNode; badge?: string }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        {badge && <Badge variant="outline">{badge}</Badge>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return <p className="text-sm text-muted-foreground py-6 text-center">{msg}</p>;
}

export default function AdminOperacaoPage() {
  const dlq = useQuery({
    queryKey: ['admin-op', 'dlq'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dlq_stats');
      if (error) throw error;
      return (data ?? []) as DlqRow[];
    },
    staleTime: 60_000,
  });

  const conflitos = useQuery({
    queryKey: ['admin-op', 'folha-conflicts'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('folha_conflict_stats', { _days: 7 });
      if (error) throw error;
      return (data ?? []) as ConflictRow[];
    },
    staleTime: 60_000,
  });

  const telemetry = useQuery({
    queryKey: ['admin-op', 'query-telemetry'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_query_telemetry', { _limit: 10 });
      if (error) throw error;
      return (data ?? []) as TelemetryRow[];
    },
    staleTime: 60_000,
  });

  const idem = useQuery({
    queryKey: ['admin-op', 'idempotency-health'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_idempotency_health');
      if (error) throw error;
      return (data ?? []) as IdemRow[];
    },
    staleTime: 60_000,
  });

  const refetchAll = () => {
    dlq.refetch();
    conflitos.refetch();
    telemetry.refetch();
    idem.refetch();
  };

  const totalDlq = dlq.data?.reduce((s, r) => s + Number(r.total_dlq || 0), 0) ?? 0;
  const totalConflitos = conflitos.data?.reduce((s, r) => s + Number(r.conflitos || 0), 0) ?? 0;
  const idemFailingHigh = idem.data?.filter(r => Number(r.failure_rate_pct) > 5).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageTitle
          title="Operação — Painel Consolidado"
          description="DLQ, conflitos de folha, queries lentas e saúde de idempotência em tempo real."
        />
        <Button onClick={refetchAll} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Atualizar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase">DLQ (fila morta)</p>
                <p className="text-3xl font-bold mt-1">{totalDlq}</p>
              </div>
              <ShieldAlert className={`h-8 w-8 ${totalDlq > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Conflitos folha (7d)</p>
                <p className="text-3xl font-bold mt-1">{totalConflitos}</p>
              </div>
              <GitBranch className={`h-8 w-8 ${totalConflitos > 5 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Endpoints com falha &gt; 5%</p>
                <p className="text-3xl font-bold mt-1">{idemFailingHigh}</p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${idemFailingHigh > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DLQ */}
      <SectionCard title="Dead-Letter Queue (fila_processamento)" icon={ShieldAlert} badge={`${dlq.data?.length ?? 0} tipos`}>
        {dlq.isLoading ? <Skeleton className="h-24" /> :
         !dlq.data?.length ? <EmptyState msg="Nenhuma tarefa em DLQ. Fila saudável ✓" /> : (
          <div className="space-y-2">
            {dlq.data.map(r => (
              <div key={r.tipo_tarefa} className="flex items-start justify-between gap-3 p-3 rounded-md border border-border/50">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-medium">{r.tipo_tarefa}</p>
                  {r.ultimo_erro_sample && <p className="text-xs text-muted-foreground mt-1 truncate">{r.ultimo_erro_sample}</p>}
                  {r.mais_recente && <p className="text-xs text-muted-foreground mt-0.5">Mais recente: {formatDistanceToNow(new Date(r.mais_recente), { addSuffix: true, locale: ptBR })}</p>}
                </div>
                <Badge variant="destructive">{r.total_dlq}</Badge>
              </div>
            ))}
          </div>
         )}
      </SectionCard>

      {/* Conflitos de folha */}
      <SectionCard title="Conflitos de Concorrência (folha_pagamento)" icon={GitBranch} badge="últimos 7 dias">
        {conflitos.isLoading ? <Skeleton className="h-24" /> :
         !conflitos.data?.length ? <EmptyState msg="Nenhum conflito de concorrência detectado ✓" /> : (
          <div className="space-y-2">
            {conflitos.data.map(r => (
              <div key={r.competencia} className="flex items-center justify-between p-3 rounded-md border border-border/50">
                <div>
                  <p className="font-mono text-sm font-medium">{r.competencia}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.ultimo_em), { addSuffix: true, locale: ptBR })}</p>
                </div>
                <Badge variant="secondary">{r.conflitos}</Badge>
              </div>
            ))}
          </div>
         )}
      </SectionCard>

      {/* Query Telemetry */}
      <SectionCard title="Top 10 Queries Mais Lentas" icon={Activity} badge="pg_stat_statements">
        {telemetry.isLoading ? <Skeleton className="h-24" /> :
         !telemetry.data?.length ? <EmptyState msg="Sem dados de telemetria ainda." /> : (
          <div className="space-y-2">
            {telemetry.data.map((r, i) => (
              <div key={i} className="p-3 rounded-md border border-border/50">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge variant="outline" className="font-mono text-xs">{Number(r.mean_ms).toFixed(1)} ms média</Badge>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>{r.calls} calls</span>
                    <span>·</span>
                    <span>cache {Number(r.cache_hit_pct).toFixed(0)}%</span>
                    <span>·</span>
                    <span>max {Number(r.max_ms).toFixed(0)}ms</span>
                  </div>
                </div>
                <p className="font-mono text-xs text-muted-foreground truncate">{r.query_sample}</p>
              </div>
            ))}
          </div>
         )}
      </SectionCard>

      {/* Idempotency Health */}
      <SectionCard title="Saúde de Idempotência (24h)" icon={AlertTriangle}>
        {idem.isLoading ? <Skeleton className="h-24" /> :
         !idem.data?.length ? <EmptyState msg="Sem chamadas idempotentes nas últimas 24h." /> : (
          <div className="space-y-2">
            {idem.data.map(r => (
              <div key={r.endpoint} className="flex items-center justify-between p-3 rounded-md border border-border/50">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-medium truncate">{r.endpoint}</p>
                  <p className="text-xs text-muted-foreground">{r.total_24h} chamadas · {r.failed_24h} falhas</p>
                </div>
                <Badge variant={Number(r.failure_rate_pct) > 5 ? 'destructive' : 'secondary'}>
                  {Number(r.failure_rate_pct).toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
         )}
      </SectionCard>
    </div>
  );
}
