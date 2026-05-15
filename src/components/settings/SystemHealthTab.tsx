import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Activity, Database, HardDrive, CheckCircle, XCircle, Trash2, Download,
  RefreshCw, Loader2, Bell, Zap, Clock
} from 'lucide-react';

export function SystemHealthTab() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [cleanupResult, setCleanupResult] = useState<any>(null);
  const [backupResult, setBackupResult] = useState<any>(null);

  const runHealthcheck = async () => {
    setLoading('health');
    try {
      const result = await edgeFunctionsService.healthcheck();
      if (true) {
        setHealthData(result);
        toast.success(`Sistema: ${(result as any).status}`);
      } else {
        toast.error('Erro inesperado');
      }
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const runCleanup = async () => {
    setLoading('cleanup');
    try {
      const result = await edgeFunctionsService.limpezaDados();
      if (true) {
        setCleanupResult(result);
        toast.success(`${(result as any).total_cleaned} registros limpos!`);
      } else {
        toast.error('Erro inesperado');
      }
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const runBackup = async () => {
    setLoading('backup');
    try {
      const result = await edgeFunctionsService.backupServidor();
      if (true) {
        setBackupResult(result);
        toast.success((result as any).message);
      } else {
        toast.error('Erro inesperado');
      }
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const runAlertasDP = async () => {
    setLoading('alertas');
    try {
      const result = await edgeFunctionsService.dispararAlertasDP();
      if (true) {
        toast.success('Alertas de DP disparados com sucesso!');
      } else {
        toast.error('Erro inesperado');
      }
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const runAgendamentos = async () => {
    setLoading('agendamentos');
    try {
      const result = await edgeFunctionsService.processarAgendamentos();
      if (true) {
        toast.success(`${(result as any).processados || 0} agendamentos processados!`);
      } else {
        toast.error('Erro inesperado');
      }
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const runSincronizarBitrix = async () => {
    setLoading('bitrix');
    try {
      const result = await edgeFunctionsService.sincronizarBitrix({ action: 'sync_all' });
      if (true) {
        toast.success('Sincronização Bitrix24 iniciada!');
      } else {
        toast.error('Erro inesperado');
      }
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const runLimparCache = async () => {
    setLoading('cache');
    try {
      const result = await edgeFunctionsService.cache({ action: 'invalidate' });
      if (true) {
        toast.success('Cache do sistema limpo com sucesso!');
      } else {
        toast.error('Erro inesperado');
      }
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const StatusIcon = ({ ok }: { ok: boolean }) => ok
    ? <CheckCircle className="h-4 w-4 text-green-500" />
    : <XCircle className="h-4 w-4 text-destructive" />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Actions */}
      <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2"><Zap className="h-5 w-5" /> Ações do Sistema</CardTitle>
          <CardDescription className="font-body">Execute operações de manutenção e monitoramento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <Button onClick={runHealthcheck} disabled={loading === 'health'} variant="outline" className="rounded-xl h-auto py-3 flex-col gap-1.5 font-body">
              {loading === 'health' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Activity className="h-5 w-5" />}
              <span className="text-xs">Health Check</span>
            </Button>
            <Button onClick={runCleanup} disabled={loading === 'cleanup'} variant="outline" className="rounded-xl h-auto py-3 flex-col gap-1.5 font-body">
              {loading === 'cleanup' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
              <span className="text-xs">Limpeza</span>
            </Button>
            <Button onClick={runBackup} disabled={loading === 'backup'} variant="outline" className="rounded-xl h-auto py-3 flex-col gap-1.5 font-body">
              {loading === 'backup' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
              <span className="text-xs">Backup</span>
            </Button>
            <Button onClick={runAlertasDP} disabled={loading === 'alertas'} variant="outline" className="rounded-xl h-auto py-3 flex-col gap-1.5 font-body">
              {loading === 'alertas' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bell className="h-5 w-5" />}
              <span className="text-xs">Alertas DP</span>
            </Button>
            <Button onClick={runAgendamentos} disabled={loading === 'agendamentos'} variant="outline" className="rounded-xl h-auto py-3 flex-col gap-1.5 font-body">
              {loading === 'agendamentos' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Clock className="h-5 w-5" />}
              <span className="text-xs">Agendamentos</span>
            </Button>
            <Button onClick={runSincronizarBitrix} disabled={loading === 'bitrix'} variant="outline" className="rounded-xl h-auto py-3 flex-col gap-1.5 font-body">
              {loading === 'bitrix' ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
              <span className="text-xs">Sync Bitrix</span>
            </Button>
            <Button onClick={runLimparCache} disabled={loading === 'cache'} variant="outline" className="rounded-xl h-auto py-3 flex-col gap-1.5 font-body border-destructive/20 text-destructive hover:bg-destructive/5">
              {loading === 'cache' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Database className="h-5 w-5" />}
              <span className="text-xs">Limpar Cache</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Health Results */}
      {healthData && (
        <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-green-500 to-emerald-500" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display flex items-center gap-2">
                <Activity className="h-5 w-5" /> Status do Sistema
              </CardTitle>
              <Badge variant={healthData.status === 'healthy' ? 'default' : 'destructive'} className="rounded-full">
                {healthData.status === 'healthy' ? '✅ Saudável' : '⚠️ Degradado'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(healthData.services || {}).map(([name, svc]: [string, any]) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                <div className="flex items-center gap-2">
                  <StatusIcon ok={svc.status === 'ok'} />
                  <span className="font-body capitalize">{name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground font-body">
                  <span>{svc.latency_ms}ms</span>
                  {svc.records != null && <Badge variant="secondary" className="rounded-full">{svc.records} registros</Badge>}
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground font-body">
              Latência total: {healthData.total_latency_ms}ms • {new Date(healthData.timestamp).toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cleanup Results */}
      {cleanupResult && (
        <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-warning to-destructive" />
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2"><Trash2 className="h-5 w-5" /> Resultado da Limpeza</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm font-body">
            {Object.entries(cleanupResult.results || {}).map(([key, val]: [string, any]) => (
              <div key={key} className="flex justify-between py-1 border-b border-border/10 last:border-0">
                <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="font-bold">{val}</span>
              </div>
            ))}
            <div className="pt-2 flex justify-between text-base font-bold border-t border-border/30">
              <span>Total limpo:</span>
              <span className="text-primary">{cleanupResult.total_cleaned}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup Results */}
      {backupResult && (
        <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-primary-glow to-primary" />
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2"><Database className="h-5 w-5" /> Resultado do Backup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm font-body">
            {Object.entries(backupResult.tables || {}).map(([table, info]: [string, any]) => (
              <div key={table} className="flex justify-between py-1 border-b border-border/10 last:border-0">
                <span className="text-muted-foreground">{table}</span>
                <span className="font-bold">{info.error ? <span className="text-destructive text-xs">{info.error}</span> : info.count}</span>
              </div>
            ))}
            <div className="pt-2 flex justify-between text-base font-bold border-t border-border/30">
              <span>Total registros:</span>
              <span className="text-primary">{backupResult.total_records}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
