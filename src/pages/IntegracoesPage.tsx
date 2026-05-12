import { PageTitle } from '@/components/PageTitle';
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
import { Plug, ExternalLink, RefreshCw, CheckCircle, XCircle, Settings, History, Plus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { bitrix24Service } from '@/services/tabelasComplementaresService';
import { cnabService, webhookService } from '@/services/integracaoService';
import { toast } from 'sonner';
import { whatsappService, WhatsAppConfig } from '@/services/whatsappService';
import { useEmpresas } from '@/hooks/useEmpresas';

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
  { id: 'ponto', nome: 'Relógio de Ponto', descricao: 'Integração com REPs homologados', status: 'inativo', gradient: 'from-primary/60 to-primary/90', icon: '⏰' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ativo: { label: 'Ativo', color: 'bg-success/10 text-success', icon: CheckCircle },
  inativo: { label: 'Inativo', color: 'bg-muted text-muted-foreground', icon: XCircle },
  configurando: { label: 'Configurando', color: 'bg-warning/10 text-warning', icon: RefreshCw },
};

function Bitrix24ConfigPanel() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('config');

  const { data: config, isLoading: loadConfig } = useQuery<any>({
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

  const sincronizar = useMutation({
    mutationFn: async () => {
      const { data, error } = await (window as any).supabase.functions.invoke('sincronizar-bitrix', {
        body: { action: 'sync_all' }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['bitrix24_sync_logs'] });
      toast.success(`Sincronização concluída: ${res.data.totals.success} sucessos.`);
    },
    onError: (err: any) => toast.error(`Falha no Sync: ${err.message}`),
  });

  if (loadConfig) return <div className="flex justify-center py-8"><Spinner /></div>;

  return (
    <>
    <PageTitle title="Integrações" description="Conectores e integrações externas" />
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
          <div className="flex gap-2">
            <Button onClick={() => salvar.mutate()} disabled={!form.webhook_url || salvar.isPending} className="flex-1">{salvar.isPending ? 'Salvando...' : 'Salvar Configuração'}</Button>
            <Button variant="outline" onClick={() => sincronizar.mutate()} disabled={!config?.habilitado || sincronizar.isPending}>
              {sincronizar.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Sync Agora
            </Button>
          </div>
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
    </>
  );
}

function CnabConfigPanel() {
  const [tab, setTab] = useState('remessas');
  const { data: config } = useQuery({ queryKey: ['cnab_config'], queryFn: cnabService.getConfig });
  const { data: remessas = [], isLoading } = useQuery({ queryKey: ['cnab_remessas'], queryFn: cnabService.getRemessas });

  return (
    <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 border-b border-border/20 bg-muted/20">
        <TabsList className="h-12 bg-transparent gap-4">
          <TabsTrigger value="remessas" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Remessas Geradas</TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Configuração Bancária</TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <TabsContent value="remessas" className="m-0">
          {isLoading ? <Spinner /> : (
            <Table>
              <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Banco</TableHead><TableHead>Arquivo</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {remessas.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">Nenhuma remessa gerada</TableCell></TableRow> :
                  remessas.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs">{new Date(r.created_at).toLocaleString('pt-BR')}</TableCell>
                      <TableCell className="font-medium text-sm">{r.banco_nome || 'Banco do Brasil'}</TableCell>
                      <TableCell className="font-mono text-xs">{r.nome_arquivo || `REMESSA_${r.id.slice(0, 8)}.txt`}</TableCell>
                      <TableCell><Badge variant="outline" className="bg-success/10 text-success border-0">{r.status || 'Processado'}</Badge></TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-8 rounded-lg"><ExternalLink className="h-3 w-3 mr-2" />Download</Button></TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="config" className="m-0">
          <div className="grid gap-6 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><Label>Banco Principal</Label><Input placeholder="Ex: Itaú Unibanco" defaultValue={config?.banco_nome} /></div>
               <div className="space-y-2"><Label>Código do Banco</Label><Input placeholder="Ex: 341" defaultValue={config?.banco_codigo} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><Label>Agência</Label><Input placeholder="0000" defaultValue={config?.agencia} /></div>
               <div className="space-y-2"><Label>Conta Corrente</Label><Input placeholder="00000-0" defaultValue={config?.conta} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><Label>Layout CNAB</Label><Input placeholder="Ex: CNAB 240" defaultValue={config?.layout_cnab} /></div>
               <div className="space-y-2"><Label>Convênio</Label><Input placeholder="Código de convênio" defaultValue={config?.convenio} /></div>
            </div>
            <Button className="w-fit px-8 rounded-xl shadow-lg shadow-primary/20">Salvar Configurações</Button>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

function WebhookConfigPanel() {
  const [tab, setTab] = useState('webhooks');
  const { data: webhooks = [], isLoading: loadWebhooks } = useQuery({ queryKey: ['webhooks'], queryFn: webhookService.listar });
  const { data: logs = [], isLoading: loadLogs } = useQuery({ queryKey: ['webhook_logs'], queryFn: webhookService.getLogs });

  return (
    <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 border-b border-border/20 bg-muted/20">
        <TabsList className="h-12 bg-transparent gap-4">
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Webhooks Ativos</TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Logs de Entrega</TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <TabsContent value="webhooks" className="m-0">
           <div className="flex justify-between items-center mb-6">
              <div><h3 className="font-semibold text-lg">Seus Webhooks</h3><p className="text-sm text-muted-foreground">Configure URLs para receber eventos do sistema</p></div>
              <Button size="sm" className="rounded-xl"><Plus className="h-4 w-4 mr-2" />Novo Webhook</Button>
           </div>
           {loadWebhooks ? <Spinner /> : (
             <div className="grid gap-4">
                {webhooks.length === 0 ? <div className="p-12 text-center border border-dashed rounded-2xl text-muted-foreground">Clique em "Novo Webhook" para começar</div> :
                  webhooks.map((w: any) => (
                    <Card key={w.id} className="border-border/30 overflow-hidden group">
                       <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-primary/10 rounded-xl"><Zap className="h-5 w-5 text-primary" /></div>
                             <div>
                                <h4 className="font-medium text-sm">{w.nome}</h4>
                                <p className="text-xs font-mono text-muted-foreground">{w.url}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <Badge variant="outline" className="bg-success/10 text-success border-0">Ativo</Badge>
                             <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"><XCircle className="h-4 w-4" /></Button>
                          </div>
                       </CardContent>
                    </Card>
                  ))
                }
             </div>
           )}
        </TabsContent>

        <TabsContent value="logs" className="m-0">
           {loadLogs ? <Spinner /> : (
             <Table>
                <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Webhook</TableHead><TableHead>Evento</TableHead><TableHead>Status</TableHead><TableHead>Resposta</TableHead></TableRow></TableHeader>
                <TableBody>
                   {logs.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">Nenhum log de entrega</TableCell></TableRow> :
                     logs.map((l: any) => (
                       <TableRow key={l.id}>
                          <TableCell className="text-xs">{new Date(l.created_at).toLocaleString('pt-BR')}</TableCell>
                          <TableCell className="text-sm">{l.webhook_nome || 'Webhook Principal'}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{l.evento || 'colaborador.criado'}</Badge></TableCell>
                          <TableCell>{l.status_code === 200 ? <Badge className="bg-success text-white">200 OK</Badge> : <Badge variant="destructive">{l.status_code || 'Erro'}</Badge>}</TableCell>
                          <TableCell className="text-xs font-mono max-w-[150px] truncate text-muted-foreground">{l.response_body || '—'}</TableCell>
                       </TableRow>
                     ))
                   }
                </TableBody>
             </Table>
           )}
        </TabsContent>
      </div>
    </Tabs>
  );
}

function WhatsAppConfigPanel() {
  const { empresaAtual } = useEmpresas();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Partial<WhatsAppConfig>>({
    instancia_url: '',
    api_key: '',
    instancia_nome: 'default',
    notificar_ponto: true,
    notificar_ferias: true,
    notificar_holerite: true
  });

  const { data: existingConfig, isLoading } = useQuery({
    queryKey: ['whatsapp_config', empresaAtual?.id],
    queryFn: () => whatsappService.getConfig(empresaAtual!.id),
    enabled: !!empresaAtual?.id
  });

  useState(() => {
    if (existingConfig) setConfig(existingConfig);
  });

  const salvar = async () => {
    if (!empresaAtual?.id) return;
    setLoading(true);
    try {
      await whatsappService.saveConfig({ ...config, empresa_id: empresaAtual.id });
      toast.success('Configuração de WhatsApp salva!');
    } catch (e) {
      toast.error('Erro ao salvar configuração');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 max-w-lg">
        <div className="space-y-2">
          <Label>URL da Instância (Evolution API)</Label>
          <Input 
            value={config.instancia_url || ''} 
            onChange={e => setConfig(p => ({ ...p, instancia_url: e.target.value }))} 
            placeholder="https://sua-api.com" 
          />
        </div>
        <div className="space-y-2">
          <Label>API Key</Label>
          <Input 
            type="password"
            value={config.api_key || ''} 
            onChange={e => setConfig(p => ({ ...p, api_key: e.target.value }))} 
            placeholder="Sua chave secreta" 
          />
        </div>
        <div className="space-y-2">
          <Label>Nome da Instância</Label>
          <Input 
            value={config.instancia_nome || ''} 
            onChange={e => setConfig(p => ({ ...p, instancia_nome: e.target.value }))} 
            placeholder="default" 
          />
        </div>
        
        <div className="pt-4 space-y-4">
          <h4 className="text-sm font-semibold border-b pb-2">Notificações Automáticas</h4>
          <div className="flex items-center justify-between">
            <Label>Notificar registro de ponto</Label>
            <Switch checked={config.notificar_ponto} onCheckedChange={v => setConfig(p => ({ ...p, notificar_ponto: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Notificar aviso de férias</Label>
            <Switch checked={config.notificar_ferias} onCheckedChange={v => setConfig(p => ({ ...p, notificar_ferias: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Notificar liberação de holerite</Label>
            <Switch checked={config.notificar_holerite} onCheckedChange={v => setConfig(p => ({ ...p, notificar_holerite: v }))} />
          </div>
        </div>

        <Button onClick={salvar} disabled={loading} className="w-full rounded-xl mt-4">
          {loading ? 'Salvando...' : 'Salvar e Ativar Integração'}
        </Button>
      </div>
    </div>
  );
}

export default function IntegracoesPage() {
  const [bitrixOpen, setBitrixOpen] = useState(false);
  const [cnabOpen, setCnabOpen] = useState(false);
  const [webhookOpen, setWebhookOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const { empresaAtual } = useEmpresas();

  return (
    <PageLayout title="Integrações" description="Conecte o sistema a serviços externos" icon={<Plug className="h-5 w-5 text-primary-foreground" />} gradient="from-primary/80 to-primary">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Bitrix24 Card */}
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

        {/* WhatsApp Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="group border border-border/30 rounded-2xl hover:shadow-elevated hover:border-border/60 transition-all overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-success to-success/60" />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <CardTitle className="font-display text-base">WhatsApp (Evolution)</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] gap-1 bg-muted text-muted-foreground">
                  <Settings className="h-3 w-3" />Configurável
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-body mb-4">Envio de holerites, alertas de ponto e notificações automáticas via WhatsApp</p>
              <Dialog open={whatsappOpen} onOpenChange={setWhatsappOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full rounded-xl border-border/40 hover:bg-muted font-body transition-colors">
                    Configurar Integração
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl">
                  <DialogHeader className="p-6 bg-muted/20 border-b border-border/10">
                    <DialogTitle className="font-display">Integração WhatsApp — Evolution API</DialogTitle>
                  </DialogHeader>
                  <WhatsAppConfigPanel />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bancos (CNAB) Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="group border border-border/30 rounded-2xl hover:shadow-elevated hover:border-border/60 transition-all overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-glow to-primary" />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏦</span>
                  <CardTitle className="font-display text-base">Bancos (CNAB)</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] gap-1 bg-success/10 text-success">
                  <CheckCircle className="h-3 w-3" />Pronto
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-body mb-4">Geração automática de arquivos CNAB 240/400 para folha</p>
              <Dialog open={cnabOpen} onOpenChange={setCnabOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full rounded-xl font-body gap-2 group-hover:border-primary/30">
                    <Settings className="h-3.5 w-3.5" />Configurar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0">
                   <DialogHeader className="p-6 pb-2">
                     <DialogTitle>Bancos (CNAB) — Configuração & Remessas</DialogTitle>
                   </DialogHeader>
                   <CnabConfigPanel />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>

        {/* Webhooks Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="group border border-border/30 rounded-2xl hover:shadow-elevated hover:border-border/60 transition-all overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/80 to-primary" />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔔</span>
                  <CardTitle className="font-display text-base">Webhooks</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] gap-1 bg-primary/10 text-primary">
                  <Zap className="h-3 w-3" />Em tempo real
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-body mb-4">Envio de notificações automáticas para URLs externas</p>
              <Dialog open={webhookOpen} onOpenChange={setWebhookOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full rounded-xl font-body gap-2 group-hover:border-primary/30">
                    <Settings className="h-3.5 w-3.5" />Configurar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Webhooks — Notificações Externas</DialogTitle>
                  </DialogHeader>
                  <WebhookConfigPanel />
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
