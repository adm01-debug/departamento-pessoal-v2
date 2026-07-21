import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageTitle } from '@/components/PageTitle';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle2, XCircle, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

type Status = 'idle' | 'running' | 'ok' | 'warn' | 'fail';

interface Check {
  id: string;
  label: string;
  category: 'infra' | 'tabelas' | 'edge' | 'cron';
  status: Status;
  detail?: string;
}

const CRITICAL_TABLES = ['colaboradores', 'empresas', 'user_roles', 'folhas_pagamento', 'profiles'];
const EDGE_FUNCTIONS = ['healthcheck', 'metricas', 'external-db-bridge'];

const initialChecks = (): Check[] => [
  { id: 'env', label: 'VITE_SUPABASE_URL definida', category: 'infra', status: 'idle' },
  { id: 'auth', label: 'Sessão Auth acessível', category: 'infra', status: 'idle' },
  ...CRITICAL_TABLES.map<Check>((t) => ({
    id: `tab:${t}`, label: `Tabela ${t} acessível`, category: 'tabelas', status: 'idle',
  })),
  ...EDGE_FUNCTIONS.map<Check>((f) => ({
    id: `fn:${f}`, label: `Edge function ${f}`, category: 'edge', status: 'idle',
  })),
  { id: 'cron', label: 'Cron jobs registrados (cron.job)', category: 'cron', status: 'idle' },
];

export default function AdminDiagnosticoMigracaoPage() {
  const [checks, setChecks] = useState<Check[]>(initialChecks());
  const [running, setRunning] = useState(false);

  const update = (id: string, patch: Partial<Check>) =>
    setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const run = async () => {
    setRunning(true);
    setChecks(initialChecks().map((c) => ({ ...c, status: 'running' as Status })));

    // 1. env
    const url = import.meta.env.VITE_SUPABASE_URL;
    update('env', url
      ? { status: 'ok', detail: String(url) }
      : { status: 'fail', detail: 'não definida' });

    // 2. auth session
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) update('auth', { status: 'fail', detail: error.message });
      else update('auth', { status: 'ok', detail: data.session ? 'logado' : 'sem sessão (esperado se anônimo)' });
    } catch (e) {
      update('auth', { status: 'fail', detail: (e as Error).message });
    }

    // 3. tabelas críticas — head + count
    await Promise.all(CRITICAL_TABLES.map(async (t) => {
      try {
        const { error, count } = await (supabase.from(t) as any)
          .select('*', { count: 'exact', head: true })
          .limit(1);
        if (error) update(`tab:${t}`, { status: 'fail', detail: error.message });
        else update(`tab:${t}`, { status: 'ok', detail: `${count ?? 0} registros` });
      } catch (e) {
        update(`tab:${t}`, { status: 'fail', detail: (e as Error).message });
      }
    }));

    // 4. edge functions
    await Promise.all(EDGE_FUNCTIONS.map(async (fn) => {
      try {
        const { data, error } = await supabase.functions.invoke(fn, { body: {} });
        if (error) {
          const status = /404|not found/i.test(error.message) ? 'fail' : 'warn';
          update(`fn:${fn}`, { status, detail: error.message });
        } else {
          update(`fn:${fn}`, { status: 'ok', detail: typeof data === 'object' ? 'resposta ok' : String(data).slice(0, 60) });
        }
      } catch (e) {
        update(`fn:${fn}`, { status: 'fail', detail: (e as Error).message });
      }
    }));

    // 5. cron jobs (via RPC se existir)
    try {
      const { data, error } = await (supabase as any).rpc('cron_job_list_diag', {});
      if (error) {
        update('cron', { status: 'warn', detail: 'RPC cron_job_list_diag ausente (opcional)' });
      } else {
        const n = Array.isArray(data) ? data.length : 0;
        update('cron', { status: n > 0 ? 'ok' : 'warn', detail: `${n} jobs` });
      }
    } catch (e) {
      update('cron', { status: 'warn', detail: (e as Error).message });
    }

    setRunning(false);
  };

  useEffect(() => { run(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const grouped = {
    infra: checks.filter((c) => c.category === 'infra'),
    tabelas: checks.filter((c) => c.category === 'tabelas'),
    edge: checks.filter((c) => c.category === 'edge'),
    cron: checks.filter((c) => c.category === 'cron'),
  };

  const counts = checks.reduce(
    (acc, c) => ({ ...acc, [c.status]: (acc[c.status] ?? 0) + 1 }),
    {} as Record<Status, number>,
  );

  return (
    <>
      <PageTitle title="Diagnóstico da Migração" description="Sanity-check pós-cutover Supabase" />
      <PageLayout
        title="Diagnóstico da Migração"
        description="Valida se o novo projeto Supabase responde a queries, edge functions e cron jobs"
        icon={<Activity className="h-5 w-5 text-primary-foreground" />}
        gradient="from-primary to-primary/60"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-emerald-600 border-emerald-600/40">
              OK {counts.ok ?? 0}
            </Badge>
            <Badge variant="outline" className="text-amber-600 border-amber-600/40">
              Alerta {counts.warn ?? 0}
            </Badge>
            <Badge variant="outline" className="text-destructive border-destructive/40">
              Falha {counts.fail ?? 0}
            </Badge>
          </div>
          <Button onClick={run} disabled={running} size="sm">
            {running ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Rodar novamente
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(['infra', 'tabelas', 'edge', 'cron'] as const).map((cat) => (
            <Card key={cat}>
              <CardHeader>
                <CardTitle className="capitalize text-base">{cat}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {grouped[cat].map((c) => (
                  <div key={c.id} className="flex items-start justify-between gap-3 py-1.5 border-b border-border/40 last:border-0">
                    <div className="flex items-start gap-2 min-w-0">
                      <StatusIcon status={c.status} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{c.label}</p>
                        {c.detail && (
                          <p className="text-xs text-muted-foreground truncate">{c.detail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-6 text-sm space-y-2">
            <p className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Como usar este diagnóstico
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Falhas em <strong>tabelas</strong> → schema/dados não restaurados no novo projeto.</li>
              <li>Falhas em <strong>edge functions</strong> → rode <code>scripts/deploy-functions-novo-projeto.sh</code>.</li>
              <li>Alerta em <strong>cron</strong> → aplique <code>03_cron_jobs.sql</code> no SQL Editor.</li>
              <li>Checklist completo em <code>docs/CUTOVER_VALIDACAO.md</code>.</li>
            </ul>
          </CardContent>
        </Card>
      </PageLayout>
    </>
  );
}

function StatusIcon({ status }: { status: Status }) {
  if (status === 'ok') return <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />;
  if (status === 'fail') return <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />;
  if (status === 'warn') return <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />;
  if (status === 'running') return <Loader2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 animate-spin" />;
  return <div className="h-4 w-4 rounded-full bg-muted shrink-0 mt-0.5" />;
}
