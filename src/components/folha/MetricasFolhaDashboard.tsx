/**
 * MetricasFolhaDashboard — consome a edge `folha-metrics` (últimas 24h)
 * e apresenta KPIs + breakdowns por status/endpoint/ação.
 * Restrito a admin/rh (a edge faz o gate).
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Activity, ShieldAlert, CheckCircle2, Bell } from 'lucide-react';

type Metrics = {
  window_hours: number;
  generated_at: string;
  idempotency: {
    total: number;
    by_status: Record<string, number>;
    by_endpoint: Record<string, number>;
  };
  folha_audit: {
    total: number;
    by_acao: Record<string, number>;
  };
  alerts: {
    slack_configured: boolean;
    triggered: boolean;
    thresholds: { conflict: number; failed: number };
  };
};

export function MetricasFolhaDashboard() {
  const { data, isLoading, error } = useQuery<Metrics>({
    queryKey: ['folha-metrics-24h'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('folha-metrics', { method: 'GET' });
      if (error) throw error;
      return data as Metrics;
    },
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando métricas…
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Métricas indisponíveis no momento (requer perfil admin/rh).
        </CardContent>
      </Card>
    );
  }

  const conflicts = data.idempotency.by_status?.['conflict'] ?? 0;
  const failed = data.idempotency.by_status?.['failed'] ?? 0;
  const succeeded = data.idempotency.by_status?.['succeeded'] ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Kpi title="Idempotência (24h)" value={data.idempotency.total} icon={<Activity className="h-4 w-4" />} />
      <Kpi title="Sucessos" value={succeeded} icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} />
      <Kpi
        title="Conflitos"
        value={conflicts}
        icon={<ShieldAlert className="h-4 w-4 text-amber-500" />}
        hint={`limite ${data.alerts.thresholds.conflict}`}
      />
      <Kpi
        title="Falhas"
        value={failed}
        icon={<ShieldAlert className="h-4 w-4 text-destructive" />}
        hint={`limite ${data.alerts.thresholds.failed}`}
      />

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm">Idempotência por endpoint</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.entries(data.idempotency.by_endpoint).length === 0 && (
            <span className="text-xs text-muted-foreground">Sem chamadas nas últimas 24h.</span>
          )}
          {Object.entries(data.idempotency.by_endpoint).map(([k, v]) => (
            <Badge key={k} variant="outline">{k}: {v}</Badge>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm">Eventos de folha por ação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.entries(data.folha_audit.by_acao).length === 0 && (
            <span className="text-xs text-muted-foreground">Sem eventos nas últimas 24h.</span>
          )}
          {Object.entries(data.folha_audit.by_acao).map(([k, v]) => (
            <Badge key={k} variant="outline">{k}: {v}</Badge>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-4">
        <CardContent className="flex items-center justify-between py-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Bell className="h-3 w-3" />
            Alertas Slack: {data.alerts.slack_configured ? (
              <Badge variant={data.alerts.triggered ? 'destructive' : 'outline'}>
                {data.alerts.triggered ? 'disparado' : 'armado'}
              </Badge>
            ) : (
              <Badge variant="outline">não configurado</Badge>
            )}
          </div>
          <span>Atualizado: {new Date(data.generated_at).toLocaleString('pt-BR')}</span>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({
  title,
  value,
  icon,
  hint,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
