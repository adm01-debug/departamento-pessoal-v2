import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Upload, Clock, CheckCircle, AlertTriangle, Database, HardDrive, RefreshCw, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { formatDateTime, formatBytes } from '@/utils/formatters';
import { api } from '@/lib/api';

interface Backup {
  id: string;
  nome: string;
  tipo: 'completo' | 'incremental' | 'diferencial';
  status: 'sucesso' | 'falha' | 'em_andamento';
  tamanho: number;
  duracao: number;
  createdAt: string;
  tabelas: string[];
}

interface BackupConfig {
  autoBackup: boolean;
  frequencia: 'diario' | 'semanal' | 'mensal';
  horario: string;
  retencao: number;
  destino: 'local' | 's3' | 'gcs';
}

export default function BackupPage() {
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: backups, isLoading } = useQuery<Backup[]>({
    queryKey: ['backups'],
    queryFn: async () => { const r = await api.get('/backups'); return r.data; },
  });

  const { data: config } = useQuery<BackupConfig>({
    queryKey: ['backup-config'],
    queryFn: async () => { const r = await api.get('/backups/config'); return r.data; },
  });

  const { data: stats } = useQuery({
    queryKey: ['backup-stats'],
    queryFn: async () => { const r = await api.get('/backups/stats'); return r.data; },
  });

  const createBackupMutation = useMutation({
    mutationFn: async (tipo: string) => {
      setIsBackupRunning(true);
      setBackupProgress(0);
      const interval = setInterval(() => setBackupProgress(p => Math.min(p + 10, 90)), 500);
      const r = await api.post('/backups', { tipo });
      clearInterval(interval);
      setBackupProgress(100);
      return r.data;
    },
    onSuccess: () => {
      toast({ title: 'Backup criado', description: 'O backup foi criado com sucesso.' });
      queryClient.invalidateQueries({ queryKey: ['backups'] });
      setIsBackupRunning(false);
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Falha ao criar backup.', variant: 'destructive' });
      setIsBackupRunning(false);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => { const r = await api.post(`/backups/${id}/restore`); return r.data; },
    onSuccess: () => {
      toast({ title: 'Restauração iniciada', description: 'O sistema será restaurado em breve.' });
      setIsRestoreOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/backups/${id}`); },
    onSuccess: () => {
      toast({ title: 'Backup excluído' });
      queryClient.invalidateQueries({ queryKey: ['backups'] });
    },
  });

  const statusConfig = {
    sucesso: { label: 'Sucesso', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    falha: { label: 'Falha', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
    em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
  };

  return (
    <PageLayout>
      <PageHeader title="Backup e Restauração" description="Gerencie backups do sistema e restaure dados" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Configurações', href: '/configuracoes' }, { label: 'Backup' }]}
        actions={<div className="flex gap-2"><Button variant="outline" onClick={() => document.getElementById('restore-file')?.click()}><Upload className="w-4 h-4 mr-2" />Restaurar Arquivo</Button><Button onClick={() => createBackupMutation.mutate('completo')} disabled={isBackupRunning}><Download className="w-4 h-4 mr-2" />{isBackupRunning ? 'Criando...' : 'Novo Backup'}</Button></div>}
      />
      <input type="file" id="restore-file" className="hidden" accept=".zip,.sql,.bak" onChange={(e) => {}} />

      {isBackupRunning && <Card className="mb-6"><CardContent className="pt-6"><div className="flex items-center gap-4"><RefreshCw className="w-5 h-5 animate-spin" /><div className="flex-1"><p className="font-medium">Criando backup...</p><Progress value={backupProgress} className="mt-2" /></div><span className="text-sm text-muted-foreground">{backupProgress}%</span></div></CardContent></Card>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total de Backups</p><p className="text-2xl font-bold">{stats?.total || 0}</p></div><Database className="w-8 h-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Último Backup</p><p className="text-lg font-medium">{stats?.ultimo ? formatDateTime(stats.ultimo) : 'Nunca'}</p></div><Clock className="w-8 h-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Tamanho Total</p><p className="text-2xl font-bold">{formatBytes(stats?.tamanhoTotal || 0)}</p></div><HardDrive className="w-8 h-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Taxa de Sucesso</p><p className="text-2xl font-bold text-green-600">{stats?.taxaSucesso || 0}%</p></div><CheckCircle className="w-8 h-8 text-green-600" /></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Histórico de Backups</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <LoadingSpinner /> : (
              <div className="space-y-3">
                {backups?.map(backup => {
                  const cfg = statusConfig[backup.status];
                  const Icon = cfg.icon;
                  return (
                    <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Database className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{backup.nome}</p>
                          <p className="text-sm text-muted-foreground">{formatDateTime(backup.createdAt)} • {formatBytes(backup.tamanho)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={cfg.color}><Icon className="w-3 h-3 mr-1" />{cfg.label}</Badge>
                        <Badge variant="outline">{backup.tipo}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedBackup(backup); setIsRestoreOpen(true); }}><RefreshCw className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => window.open(`/api/backups/${backup.id}/download`)}><Download className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(backup.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Configurações</CardTitle><CardDescription>Configure backups automáticos</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between"><Label>Backup Automático</Label><Switch checked={config?.autoBackup} /></div>
            <div><Label>Frequência</Label><Select value={config?.frequencia}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="diario">Diário</SelectItem><SelectItem value="semanal">Semanal</SelectItem><SelectItem value="mensal">Mensal</SelectItem></SelectContent></Select></div>
            <div><Label>Retenção (dias)</Label><Select value={String(config?.retencao)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">7 dias</SelectItem><SelectItem value="30">30 dias</SelectItem><SelectItem value="90">90 dias</SelectItem><SelectItem value="365">1 ano</SelectItem></SelectContent></Select></div>
            <Button className="w-full">Salvar Configurações</Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Restaurar Backup</DialogTitle><DialogDescription>Tem certeza que deseja restaurar o backup "{selectedBackup?.nome}"? Esta ação substituirá todos os dados atuais.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setIsRestoreOpen(false)}>Cancelar</Button><Button variant="destructive" onClick={() => selectedBackup && restoreMutation.mutate(selectedBackup.id)}>Restaurar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
