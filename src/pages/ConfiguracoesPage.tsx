import { PageTitle } from '@/components/PageTitle';
import { useAuth } from '@/hooks/useAuth';
import { AdminRoute } from '@/components/AdminRoute';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormSelect, FormSwitch } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Plus, Trash2, Bell, Shield, Layers, ShieldBan, Plug, Webhook, Eye, Activity, Database, ScrollText, Users, RefreshCw } from 'lucide-react';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';
import { CamposCustomizadosTab } from '@/components/settings/CamposCustomizadosTab';
import { IPBlockingTab } from '@/components/settings/IPBlockingTab';
import { SystemHealthTab } from '@/components/settings/SystemHealthTab';
import { ConfiguracoesGeraisTab } from '@/components/settings/ConfiguracoesGeraisTab';
import { LogsIntegracoesTab } from '@/components/settings/LogsIntegracoesTab';
import { MFASetup } from '@/components/settings/MFASetup';
import { EmpresaSettingsTab } from '@/components/settings/EmpresaSettingsTab';
import { UserRolesTab } from '@/components/settings/UserRolesTab';
import { GlobalAuditLogTab } from '@/components/settings/GlobalAuditLogTab';

import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ConfiguracoesPage() {
  const { user, isAdmin } = useAuth();
  const qc = useQueryClient();

  // === Config Alertas Indicadores ===
  const [openAlerta, setOpenAlerta] = useState(false);
  const [alertaForm, setAlertaForm] = useState({ tipo: '', limite_atencao: '', limite_critico: '' });

  const { data: alertasConfig = [], isLoading: loadAlertas } = useQuery({
    queryKey: ['config-alertas-indicadores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('config_alertas_indicadores' as any).select('*').order('tipo');
      if (error) throw error;
      return data || [];
    },
  });

  // === Integrações ===
  const { data: integracoes = [], isLoading: loadInteg } = useQuery({
    queryKey: ['integracoes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('integracoes' as any).select('*').order('nome');
      if (error) { if (error.code === '42P01') return []; throw error; }
      return data || [];
    },
  });

  // === Webhooks Logs ===
  const { data: webhooksLogs = [], isLoading: loadWebhooks } = useQuery({
    queryKey: ['webhooks-logs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('webhooks_logs' as any).select('*').order('created_at', { ascending: false }).limit(50);
      if (error) { if (error.code === '42P01') return []; throw error; }
      return data || [];
    },
  });

  const criarAlerta = useMutation({
    mutationFn: async (d: typeof alertaForm) => {
      const { error } = await supabase.from('config_alertas_indicadores' as any).insert({
        tipo: d.tipo,
        limite_atencao: Number(d.limite_atencao),
        limite_critico: Number(d.limite_critico),
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['config-alertas-indicadores'] }); setOpenAlerta(false); setAlertaForm({ tipo: '', limite_atencao: '', limite_critico: '' }); toast.success('Configuração de alerta criada'); },
    onError: () => toast.error('Erro ao criar configuração'),
  });

  const excluirAlerta = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('config_alertas_indicadores' as any).delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['config-alertas-indicadores'] }); toast.success('Configuração removida'); },
  });

  return (
    <>
    <PageTitle title="Configurações" description="Configurações do sistema" />
    <PageLayout
      title="Configurações"
      description="Configurações do sistema"
      icon={<Settings className="h-5 w-5 text-primary-foreground" />}
      gradient="from-muted-foreground to-foreground"
    >
      <Tabs defaultValue={isAdmin ? "empresa" : "seguranca"} className="space-y-4">
        <TabsList className="bg-muted/50 rounded-xl p-1 border border-border/30 overflow-x-auto no-scrollbar flex-nowrap w-full h-auto">
          <TabsTrigger value="empresa" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Empresa</TabsTrigger>
          <TabsTrigger value="perfis" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Perfis</TabsTrigger>
          <TabsTrigger value="folha" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Folha</TabsTrigger>
          <TabsTrigger value="ponto" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Ponto</TabsTrigger>
          <TabsTrigger value="notificacoes" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Segurança</TabsTrigger>
          <TabsTrigger value="geral" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Preferências</TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="alertas" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Alertas RH</TabsTrigger>
              <TabsTrigger value="campos" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Campos Custom</TabsTrigger>
              <TabsTrigger value="ips" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Filtro IP</TabsTrigger>
              <TabsTrigger value="integracoes" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Integ.</TabsTrigger>
              <TabsTrigger value="webhooks" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Webhooks</TabsTrigger>
              <TabsTrigger value="logs-integ" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Integ. Logs</TabsTrigger>
              <TabsTrigger value="auditoria-global" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Auditoria</TabsTrigger>

              <TabsTrigger value="config-bd" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">BD</TabsTrigger>
              <TabsTrigger value="sistema" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm min-w-fit">Saúde/Sync</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="geral">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
              <CardHeader>
                <CardTitle className="font-display">Configurações Gerais</CardTitle>
                <CardDescription className="font-body">Ajustes gerais do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Nome da Empresa" defaultValue="Minha Empresa" />
                <FormSelect label="Fuso Horário" options={[{value:'america-sp',label:'América/São Paulo'}]} />
                <FormSwitch label="Modo Escuro" description="Ativar tema escuro" />
                <Button className="rounded-xl bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg font-body">Salvar</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="notificacoes">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
                <CardHeader>
                   <CardTitle className="font-display">Central de Notificações</CardTitle>
                   <CardDescription>Configure como e quando o sistema deve alertar os usuários</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 font-body">
                   <FormSwitch label="Novas Admissões" description="Notificar gestores sobre novos processos" />
                   <FormSwitch label="Férias Pendentes" description="Alertar sobre solicitações aguardando aprovação" />
                   <FormSwitch label="Vencimento de Exames" description="Avisar 15 dias antes do vencimento de ASOs" />
                   <FormSwitch label="Logs de Erro" description="Notificar administradores sobre falhas em integrações" />
                   <div className="pt-2">
                      <Button className="rounded-xl shadow-glow">Salvar Preferências</Button>
                   </div>
                </CardContent>
             </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="folha">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-primary-glow to-primary" />
              <CardHeader><CardTitle className="font-display">Configurações de Folha</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Dia de Fechamento" type="number" defaultValue="25" />
                <FormField label="Dia de Pagamento" type="number" defaultValue="5" />
                <FormSwitch label="Calcular Automaticamente" description="Calcular folha no fechamento" />
                <Button className="rounded-xl bg-gradient-to-r from-primary-glow to-primary hover:opacity-90 shadow-lg font-body">Salvar</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="ponto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-primary/60 to-primary/90" />
              <CardHeader><CardTitle className="font-display">Configurações de Ponto</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Tolerância (minutos)" type="number" defaultValue="10" />
                <FormSwitch label="Exigir Geolocalização" />
                <FormSwitch label="Exigir Foto" />
                <Button className="rounded-xl bg-gradient-to-r from-primary/60 to-primary/90 hover:opacity-90 shadow-lg font-body">Salvar</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>


        <TabsContent value="alertas">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-warning to-destructive" />
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="font-display">Configuração de Alertas de Indicadores</CardTitle>
                    <CardDescription className="font-body">Defina limites para alertas automáticos de indicadores de RH</CardDescription>
                  </div>
                  <Dialog open={openAlerta} onOpenChange={setOpenAlerta}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" />Novo Alerta</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Nova Configuração de Alerta</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <div><Label>Tipo de Indicador</Label><Input value={alertaForm.tipo} onChange={e => setAlertaForm(p => ({ ...p, tipo: e.target.value }))} placeholder="Ex: turnover, absenteismo, horas_extras" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><Label>Limite Atenção</Label><Input type="number" value={alertaForm.limite_atencao} onChange={e => setAlertaForm(p => ({ ...p, limite_atencao: e.target.value }))} placeholder="Ex: 10" /></div>
                          <div><Label>Limite Crítico</Label><Input type="number" value={alertaForm.limite_critico} onChange={e => setAlertaForm(p => ({ ...p, limite_critico: e.target.value }))} placeholder="Ex: 20" /></div>
                        </div>
                        <Button onClick={() => criarAlerta.mutate(alertaForm)} disabled={!alertaForm.tipo || !alertaForm.limite_atencao || !alertaForm.limite_critico || criarAlerta.isPending} className="w-full">{criarAlerta.isPending ? 'Salvando...' : 'Salvar'}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadAlertas ? <div className="p-8 flex justify-center"><Spinner /></div> : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Tipo Indicador</TableHead><TableHead>Limite Atenção</TableHead><TableHead>Limite Crítico</TableHead><TableHead>Atualizado</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>
                      {alertasConfig.map((a: any) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium capitalize">{a.tipo?.replace(/_/g, ' ')}</TableCell>
                          <TableCell className="text-warning font-medium">{a.limite_atencao}</TableCell>
                          <TableCell className="text-destructive font-medium">{a.limite_critico}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{new Date(a.updated_at).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell><Button variant="ghost" size="icon" onClick={() => excluirAlerta.mutate(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                        </TableRow>
                      ))}
                      {alertasConfig.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma configuração de alerta</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="seguranca">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <MFASetup />
          </motion.div>
        </TabsContent>

        <TabsContent value="campos">
          <CamposCustomizadosTab />
        </TabsContent>

        <TabsContent value="integracoes">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Quick Sync Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border border-border/30 rounded-2xl overflow-hidden shadow-elevated">
                <div className="h-[2px] bg-[#00AEEF]" />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-display">Bitrix24 CRM</CardTitle>
                    <Badge variant="outline" className="text-success border-success/30 bg-success/5">Conectado</Badge>
                  </div>
                  <CardDescription className="text-xs">Sincronize sua base de talentos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl gap-2 font-body text-xs justify-start"
                      onClick={async () => {
                        try {
                          await edgeFunctionsService.sincronizarBitrix({ action: 'sync_all' });
                          toast.success('Sincronização Bitrix24 iniciada!');
                        } catch (err: any) { toast.error(err.message); }
                      }}
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Sincronizar Tudo agora
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl gap-2 font-body text-xs justify-start">
                      <Settings className="h-3.5 w-3.5" /> Configurar Webhook
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/30 rounded-2xl overflow-hidden shadow-elevated opacity-60">
                <div className="h-[2px] bg-[#FF3333]" />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-display">RD Station</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">Em breve</Badge>
                  </div>
                  <CardDescription className="text-xs">Exportação de dados para marketing</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" disabled className="w-full rounded-xl text-xs font-body">Conectar</Button>
                </CardContent>
              </Card>

              <Card className="border border-border/30 rounded-2xl overflow-hidden shadow-elevated opacity-60">
                <div className="h-[2px] bg-[#4285F4]" />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-display">Google Workspace</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">Em breve</Badge>
                  </div>
                  <CardDescription className="text-xs">Provisionamento de contas e e-mail</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" disabled className="w-full rounded-xl text-xs font-body">Conectar</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2"><Plug className="h-5 w-5" /> Todas as Integrações</CardTitle>
                <CardDescription className="font-body text-xs">Histórico e status de conexões ativas</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loadInteg ? <div className="p-8 flex justify-center"><Spinner /></div> : (
                  <Table>
                    <TableHeader><TableRow className="bg-muted/30"><TableHead className="text-xs font-bold uppercase">Nome</TableHead><TableHead className="text-xs font-bold uppercase">Tipo</TableHead><TableHead className="text-xs font-bold uppercase">Status</TableHead><TableHead className="text-xs font-bold uppercase">Última Sync</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {integracoes.map((i: any) => (
                        <TableRow key={i.id} className="hover:bg-accent/30 transition-colors">
                          <TableCell className="font-medium text-sm">{i.nome}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{i.tipo || '-'}</TableCell>
                          <TableCell><Badge variant={i.ativo ? 'default' : 'secondary'} className="rounded-full text-[10px]">{i.ativo ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                          <TableCell className="text-[10px] text-muted-foreground font-mono">{i.ultima_sync ? new Date(i.ultima_sync).toLocaleString('pt-BR') : '-'}</TableCell>
                        </TableRow>
                      ))}
                      {integracoes.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8 font-body text-sm">Nenhuma integração personalizada configurada</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="webhooks">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-primary-glow to-primary" />
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2"><Webhook className="h-5 w-5" /> Logs de Webhooks</CardTitle>
                <CardDescription className="font-body">Últimos 50 registros de webhooks</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loadWebhooks ? <div className="p-8 flex justify-center"><Spinner /></div> : (
                  <Table>
                    <TableHeader><TableRow><TableHead>URL</TableHead><TableHead>Evento</TableHead><TableHead>Status</TableHead><TableHead>Data</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {webhooksLogs.map((w: any) => (
                        <TableRow key={w.id}>
                          <TableCell className="font-mono text-xs max-w-[200px] truncate">{w.url || w.webhook_url || '-'}</TableCell>
                          <TableCell className="text-sm">{w.evento || w.event || '-'}</TableCell>
                          <TableCell><Badge variant={w.status_code === 200 ? 'outline' : 'destructive'} className={w.status_code === 200 ? 'bg-success/10 text-success border-success/30 rounded-full' : 'rounded-full'}>{w.status_code || w.status || '-'}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{w.created_at ? new Date(w.created_at).toLocaleString('pt-BR') : '-'}</TableCell>
                        </TableRow>
                      ))}
                      {webhooksLogs.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhum log de webhook encontrado</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="ips">
          <IPBlockingTab />
        </TabsContent>

        <TabsContent value="auditoria-global">
           <GlobalAuditLogTab />
        </TabsContent>

        <TabsContent value="sistema">
          <SystemHealthTab />
        </TabsContent>


        <TabsContent value="logs-integ">
          <LogsIntegracoesTab />
        </TabsContent>

        <TabsContent value="config-bd">
          <ConfiguracoesGeraisTab />
        </TabsContent>
        <TabsContent value="perfis">
          <UserRolesTab />
        </TabsContent>
        <TabsContent value="empresa">
          <EmpresaSettingsTab />
        </TabsContent>
      </Tabs>
    </PageLayout>
    </>
  );
}