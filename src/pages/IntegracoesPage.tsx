import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Plug, ExternalLink, RefreshCw, CheckCircle, XCircle, Settings, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { bitrix24Service } from '@/services/tabelasComplementaresService';
import { toast } from 'sonner';

interface Integracao {
  id: string;
  nome: string;
  descricao: string;
  status: 'ativo' | 'inativo' | 'configurando';
  gradient: string;
  icon: string;
  hasConfig?: boolean;
}

const integracoesFixas: Integracao[] = [
  { id: 'contabilidade', nome: 'Contabilidade', descricao: 'Exportação de dados contábeis (SPED, DIRF, RAIS)', status: 'inativo', gradient: 'from-primary-glow to-primary', icon: '📊' },
  { id: 'esocial', nome: 'eSocial', descricao: 'Transmissão automática de eventos trabalhistas', status: 'ativo', gradient: 'from-primary to-primary-glow', icon: '🏛️' },
  { id: 'banco', nome: 'Bancos (CNAB)', descricao: 'Geração de arquivos bancários para folha de pagamento', status: 'inativo', gradient: 'from-primary-glow to-primary', icon: '🏦' },
  { id: 'ponto', nome: 'Relógio de Ponto', descricao: 'Integração com REPs homologados', status: 'inativo', gradient: 'from-primary/60 to-primary/90', icon: '⏰' },
  { id: 'webhook', nome: 'Webhooks', descricao: 'Notificações HTTP para sistemas externos', status: 'inativo', gradient: 'from-primary/80 to-primary', icon: '🔔' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ativo: { label: 'Ativo', color: 'bg-success/10 text-success', icon: CheckCircle },
  inativo: { label: 'Inativo', color: 'bg-muted text-muted-foreground', icon: XCircle },
  configurando: { label: 'Configurando', color: 'bg-warning/10 text-warning', icon: RefreshCw },
};

function Bitrix24ConfigPanel() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('config');

  const { data: config, isLoading: loadConfig } = useQuery({
    queryKey: ['bitrix24_config'],
    queryFn: () => bitrix24Service.getConfig(),
  });

  const { data: logs = [], isLoading: loadLogs } = useQuery({
    queryKey: ['bitrix24_sync_logs'],
    queryFn: () => bitrix24Service.getLogs(),
  });

  const [form, setForm] = useState({
    webhook_url: '',
    habilitado: false,
    sync_colaboradores: true,
    sync_departamentos: true,
    sync_cargos: true,
    intervalo_minutos: 60,
  });

  const [initialized, setInitialized] = useState(false);
  if (config && !initialized) {
    setForm({
      webhook_url: config.webhook_url || '',
      habilitado: config.habilitado || false,
      sync_colaboradores: config.sync_colaboradores ?? true,
      sync_departamentos: config.sync_departamentos ?? true,
      sync_cargos: config.sync_cargos ?? true,
      intervalo_minutos: config.intervalo_minutos || 60,
    });
    setInitialized(true);
  }

  const salvar = useMutation({
    mutationFn: () => bitrix24Service.saveConfig({ ...form, id: config?.id || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bitrix24_config'] }); toast.success('Configuração salva!'); },
    onError: () => toast.error('Erro ao salvar'),
  });

  if (loadConfig) return <div className="flex justify-center py-8"><Spinner /></div>;

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="config"><Settings className="h-3.5 w-3.5 mr-1" />Configuração</TabsTrigger>
        <TabsTrigger value="logs"><History className="h-3.5 w-3.5 mr-1" />Logs de Sincronização</TabsTrigger>
      </TabsList>

      <TabsContent value="config">
        <div className="grid gap-4 max-w-lg">
          <div><Label>Webhook URL *</Label><Input value={form.webhook_url} onChange={e => setForm(p => ({ ...p, webhook_url: e.target.value }))} placeholder="https://seu-bitrix.bitrix24.com.br/rest/..." /></div>
          <div className="flex items-center gap-3"><Switch checked={form.habilitado} onCheckedChange={v => setForm(p => ({ ...p, habilitado: v }))} /><Label>Integração Habilitada</Label></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2"><Switch checked={form.sync_colaboradores} onCheckedChange={v => setForm(p => ({ ...p, sync_colaboradores: v }))} /><Label className="text-sm">Colaboradores</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.sync_departamentos} onCheckedChange={v => setForm(p => ({ ...p, sync_departamentos: v }))} /><Label className="text-sm">Departamentos</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.sync_cargos} onCheckedChange={v => setForm(p => ({ ...p, sync_cargos: v }))} /><Label className="text-sm">Cargos</Label></div>
          </div>
          <div><Label>Intervalo de Sincronização (min)</Label><Input type="number" value={form.intervalo_minutos} onChange={e => setForm(p => ({ ...p, intervalo_minutos: Number(e.target.value) }))} /></div>
          <Button onClick={() => salvar.mutate()} disabled={!form.webhook_url || salvar.isPending}>{salvar.isPending ? 'Salvando...' : 'Salvar Configuração'}</Button>
        </div>
      </TabsContent>

      <TabsContent value="logs">
        {loadLogs ? <div className="flex justify-center py-8"><Spinner /></div> : (
          <Card><CardContent className="p-0">
            <Table><TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Tipo</TableHead><TableHead>Direção</TableHead><TableHead>Processados</TableHead><TableHead>Sucesso</TableHead><TableHead>Erros</TableHead></TableRow></TableHeader>
              <TableBody>
                {logs.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum log de sincronização</TableCell></TableRow> :
                  logs.map((l: any) => (
                    <TableRow key={l.id}>
                      <TableCell className="text-xs">{new Date(l.created_at).toLocaleString('pt-BR')}</TableCell>
                      <TableCell><Badge variant="outline">{l.tipo}</Badge></TableCell>
                      <TableCell>{l.direcao}</TableCell>
                      <TableCell>{l.registros_processados ?? 0}</TableCell>
                      <TableCell className="text-success">{l.registros_sucesso ?? l.sucesso ?? 0}</TableCell>
                      <TableCell className="text-destructive">{l.registros_erro ?? l.erros ?? 0}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </CardContent></Card>
        )}
      </TabsContent>
    </Tabs>
  );
}

export default function IntegracoesPage() {
  const [bitrixOpen, setBitrixOpen] = useState(false);

  return (
    <PageLayout title="Integrações" description="Conecte o sistema a serviços externos" icon={<Plug className="h-5 w-5 text-primary-foreground" />} gradient="from-primary/80 to-primary">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Bitrix24 Card — connected to real data */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="group border border-border/30 rounded-2xl hover:shadow-elevated hover:border-border/60 transition-all overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔗</span>
                  <CardTitle className="font-display text-base">Bitrix24</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] gap-1 bg-muted text-muted-foreground">
                  <Settings className="h-3 w-3" />Configurável
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-body mb-4">Sincronização de colaboradores, cargos e departamentos com o CRM</p>
              <Dialog open={bitrixOpen} onOpenChange={setBitrixOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full rounded-xl font-body gap-2 group-hover:border-primary/30">
                    <Settings className="h-3.5 w-3.5" />Configurar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Bitrix24 — Configuração</DialogTitle></DialogHeader>
                  <Bitrix24ConfigPanel />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>

        {/* Other integrations */}
        {integracoesFixas.map((integ, i) => {
          const statusInfo = statusConfig[integ.status];
          const StatusIcon = statusInfo.icon;
          return (
            <motion.div key={integ.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 1) * 0.08 }}>
              <Card className="group border border-border/30 rounded-2xl hover:shadow-elevated hover:border-border/60 transition-all overflow-hidden relative">
                <div className={cn('absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r', integ.gradient)} />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integ.icon}</span>
                      <CardTitle className="font-display text-base">{integ.nome}</CardTitle>
                    </div>
                    <Badge variant="outline" className={cn('text-[10px] gap-1', statusInfo.color)}>
                      <StatusIcon className="h-3 w-3" />{statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground font-body mb-4">{integ.descricao}</p>
                  <Button variant="outline" size="sm" className="w-full rounded-xl font-body gap-2 group-hover:border-primary/30">
                    <ExternalLink className="h-3.5 w-3.5" />Configurar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </PageLayout>
  );
}
