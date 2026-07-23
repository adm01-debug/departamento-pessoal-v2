/**
 * FeriasReconciliacaoHistoricoCard — observabilidade do cron self-healing
 * `reconciliar_ferias_folha_batch` (03:15 BRT). Exibe as últimas execuções
 * e destaca quando ainda restam divergências após a rodada.
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { History, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';
import { useReconciliacaoLogs } from '@/hooks/ferias/useReconciliacaoLogs';

export function FeriasReconciliacaoHistoricoCard() {
  const { data, isLoading } = useReconciliacaoLogs(10);

  const resumo = useMemo(() => {
    if (!data || data.length === 0) return null;
    const total = data.length;
    const consistentes = data.filter((l) => l.restantes === 0).length;
    const corrigidas = data.reduce((s, l) => s + (l.corrigidas ?? 0), 0);
    const duracaoMedia = Math.round(
      data.reduce((s, l) => s + (l.duracao_ms ?? 0), 0) / total,
    );
    const sla = Math.round((consistentes / total) * 100);
    return { total, consistentes, corrigidas, duracaoMedia, sla };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" aria-hidden />
          Reconciliação Automática — Histórico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aguardando a primeira execução do cron diário (03:15 BRT).
          </p>
        ) : (
          <ul className="divide-y">
            {data.map((log) => {
              const ok = log.restantes === 0;
              const Icon = ok ? CheckCircle2 : AlertTriangle;
              return (
                <li key={log.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Icon
                        className={`w-4 h-4 ${ok ? 'text-emerald-500' : 'text-amber-500'}`}
                        aria-hidden
                      />
                      <Badge variant={ok ? 'secondary' : 'destructive'}>
                        {ok ? 'Consistente' : `${log.restantes} pendente(s)`}
                      </Badge>
                      <span className="text-sm font-medium">
                        {new Date(log.executado_em).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Verificadas {log.verificadas} · Corrigidas {log.corrigidas} · Duração {log.duracao_ms} ms
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
