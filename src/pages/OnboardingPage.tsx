import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { onboardingService } from '@/services/tabelasComplementaresService';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import {
  UserPlus, CheckCircle2, Clock, FileText, Users, Building2,
  GraduationCap, Heart, Laptop, Search, Plus, Trash2, ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';

// =========== Template Tarefas Sub-component ===========
function TemplateTarefasSection({ templateId }: { templateId: string }) {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ titulo: '', descricao: '', responsavel_tipo: 'rh' });

  const { data: tarefas = [], isLoading } = useQuery({
    queryKey: ['onboarding-template-tarefas', templateId],
    queryFn: () => onboardingService.listarTemplateTarefas(templateId),
    enabled: !!templateId,
  });

  const criar = useMutation({
    mutationFn: () => onboardingService.criarTemplateTarefa({
      template_id: templateId,
      titulo: form.titulo,
      descricao: form.descricao || null,
      responsavel_tipo: form.responsavel_tipo,
      ordem: tarefas.length + 1,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['onboarding-template-tarefas', templateId] }); setAddOpen(false); setForm({ titulo: '', descricao: '', responsavel_tipo: 'rh' }); toast.success('Tarefa adicionada!'); },
    onError: () => toast.error('Erro ao adicionar tarefa'),
  });

  return (
    <div className="border rounded-lg p-3 bg-muted/20 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium flex items-center gap-1"><ListChecks className="h-3 w-3" /> Tarefas do Template ({tarefas.length})</p>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" /> Tarefa</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Tarefa do Template</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Título</Label><Input value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} /></div>
              <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} /></div>
              <div><Label>Responsável</Label>
                <Select value={form.responsavel_tipo} onValueChange={v => setForm(p => ({ ...p, responsavel_tipo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rh">RH</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="ti">TI</SelectItem>
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => criar.mutate()} disabled={!form.titulo}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <Spinner size="sm" /> : tarefas.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhuma tarefa cadastrada</p>
      ) : (
        <div className="space-y-1">
          {tarefas.map((t: any, i: number) => (
            <div key={t.id} className="flex items-center gap-2 text-sm p-1.5 rounded bg-background">
              <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
              <span className="flex-1">{t.titulo}</span>
              <Badge variant="outline" className="text-xs">{t.responsavel_tipo}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========== Onboarding Tarefas do Colaborador ===========
function OnboardingTarefasSection({ onboardingId }: { onboardingId: string }) {
  const qc = useQueryClient();

  const { data: tarefas = [] } = useQuery({
    queryKey: ['onboarding-tarefas', onboardingId],
    queryFn: () => onboardingService.listarTarefas(onboardingId),
    enabled: !!onboardingId,
  });

  const concluir = useMutation({
    mutationFn: (id: string) => onboardingService.concluirTarefa(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['onboarding-tarefas', onboardingId] }); qc.invalidateQueries({ queryKey: ['onboarding-colaboradores'] }); toast.success('Tarefa concluída!'); },
  });

  return (
    <div className="space-y-1">
      {tarefas.map((t: any) => (
        <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
          <Checkbox checked={!!t.concluida} onCheckedChange={() => !t.concluida && concluir.mutate(t.id)} />
          <span className={cn("text-sm flex-1", t.concluida && "line-through text-muted-foreground")}>{t.titulo}</span>
          {t.concluida && <CheckCircle2 className="w-4 h-4 text-success" />}
        </div>
      ))}
    </div>
  );
}

// =========== Onboarding Card ===========
function OnboardingCard({ item }: { item: any }) {
  const [expanded, setExpanded] = useState(false);
  const progresso = item.progresso || 0;
  const status = item.status || 'pendente';
  const statusConfig: Record<string, any> = {
    em_andamento: { label: 'Em Andamento', color: 'bg-warning/10 text-warning border-warning/30' },
    concluido: { label: 'Concluído', color: 'bg-success/10 text-success border-success/30' },
    pendente: { label: 'Pendente', color: 'bg-muted text-muted-foreground border-border' },
  };
  const s = statusConfig[status] || statusConfig.pendente;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{item.colaborador?.nome_completo || 'Colaborador'}</h3>
            <p className="text-xs text-muted-foreground">
              Início: {item.data_inicio ? new Date(item.data_inicio).toLocaleDateString('pt-BR') : '-'}
            </p>
          </div>
          <Badge variant="outline" className={s.color}>{s.label}</Badge>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span>{progresso}%</span>
          </div>
          <Progress value={progresso} className="h-2" />
        </div>

        <Button variant="ghost" size="sm" className="w-full" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Ocultar tarefas' : 'Ver tarefas'}
        </Button>

        {expanded && (
          <div className="pt-2 border-t border-border">
            <OnboardingTarefasSection onboardingId={item.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =========== MAIN PAGE ===========
export default function OnboardingPage(): React.ReactElement {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('onboardings');
  const [templateOpen, setTemplateOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState({ nome: '', descricao: '' });

  // ---- Onboardings ativos ----
  const { data: onboardings = [], isLoading: loadingOb } = useQuery({
    queryKey: ['onboarding-colaboradores', empresaAtual?.id],
    queryFn: () => onboardingService.listarColaboradores(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  // ---- Templates ----
  const { data: templates = [], isLoading: loadingTpl } = useQuery({
    queryKey: ['onboarding-templates', empresaAtual?.id],
    queryFn: () => onboardingService.listarTemplates(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const criarTemplate = useMutation({
    mutationFn: () => onboardingService.criarTemplate({ nome: templateForm.nome, descricao: templateForm.descricao || null, empresa_id: empresaAtual?.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['onboarding-templates'] }); setTemplateOpen(false); setTemplateForm({ nome: '', descricao: '' }); toast.success('Template criado!'); },
    onError: () => toast.error('Erro ao criar template'),
  });

  const filteredOnboardings = onboardings.filter((o: any) =>
    (o.colaborador?.nome_completo || '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: onboardings.length,
    andamento: onboardings.filter((o: any) => o.status === 'em_andamento').length,
    concluidos: onboardings.filter((o: any) => o.status === 'concluido').length,
    pendentes: onboardings.filter((o: any) => o.status === 'pendente').length,
  };

  return (
    <PageLayout
      title="Onboarding"
      description="Acompanhe a integração de novos colaboradores"
      icon={<UserPlus className="w-6 h-6 text-success" />}
    >
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="onboardings">Onboardings</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* ======== ABA ONBOARDINGS ======== */}
        <TabsContent value="onboardings" className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: stats.total, icon: Users, color: 'text-primary' },
              { label: 'Em Andamento', value: stats.andamento, icon: Clock, color: 'text-warning' },
              { label: 'Concluídos', value: stats.concluidos, icon: CheckCircle2, color: 'text-success' },
              { label: 'Pendentes', value: stats.pendentes, icon: Building2, color: 'text-muted-foreground' },
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <s.icon className={cn("w-8 h-8", s.color)} />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome do colaborador..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {loadingOb ? (
            <div className="flex justify-center p-8"><Spinner size="lg" /></div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOnboardings.map((item: any) => <OnboardingCard key={item.id} item={item} />)}
            </div>
          )}

          {!loadingOb && filteredOnboardings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum onboarding encontrado</p>
            </div>
          )}
        </TabsContent>

        {/* ======== ABA TEMPLATES ======== */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Novo Template</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo Template de Onboarding</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Nome</Label><Input value={templateForm.nome} onChange={e => setTemplateForm(p => ({ ...p, nome: e.target.value }))} /></div>
                  <div><Label>Descrição</Label><Textarea value={templateForm.descricao} onChange={e => setTemplateForm(p => ({ ...p, descricao: e.target.value }))} /></div>
                  <Button onClick={() => criarTemplate.mutate()} disabled={!templateForm.nome}>Criar Template</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loadingTpl ? (
            <div className="flex justify-center p-8"><Spinner size="lg" /></div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ListChecks className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum template criado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((t: any) => (
                <Card key={t.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t.nome}</CardTitle>
                    {t.descricao && <p className="text-sm text-muted-foreground">{t.descricao}</p>}
                  </CardHeader>
                  <CardContent>
                    <TemplateTarefasSection templateId={t.id} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
