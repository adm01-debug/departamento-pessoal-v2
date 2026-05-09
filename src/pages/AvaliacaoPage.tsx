import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { avaliacaoService } from '@/services/avaliacaoService';
import { colaboradorService } from '@/services';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Target, Plus, ClipboardList, Users, TrendingUp, Star, Trash2, LayoutGrid, Download, History, BarChart2, Calendar } from 'lucide-react';
import { PerformanceDashboard } from '@/components/avaliacao/PerformanceDashboard';
import { NineBoxMatrix } from '@/components/avaliacao/NineBoxMatrix';
import { PerformanceAuditTimeline } from '@/components/avaliacao/PerformanceAuditTimeline';
import { gerarPDIPDF } from '@/utils/evaluationPDF';


const statusColors: Record<string, string> = { rascunho: 'secondary', ativo: 'default', finalizado: 'outline', pendente: 'secondary', em_andamento: 'default', concluido: 'outline' };

const classifyScore = (score: number) => {
  if (score <= 2.5) return 1;
  if (score <= 3.5) return 2;
  return 3;
};

const getNineBoxLabel = (perf: number, pot: number) => {
  const labels: Record<string, string> = {
    '1-3': 'Enigma', '2-3': 'Alto Potencial', '3-3': 'Estrela',
    '1-2': 'Dilema', '2-2': 'Core Player', '3-2': 'Alto Profissional',
    '1-1': 'Sub-performer', '2-1': 'Efetivo', '3-1': 'Profissional Confiável'
  };
  return labels[`${perf}-${pot}`];
};

const getNineBoxColor = (perf: number, pot: number) => {
  if (perf === 3 && pot === 3) return 'bg-green-100 border-green-500 text-green-700';
  if (perf === 1 && pot === 1) return 'bg-red-100 border-red-500 text-red-700';
  if (pot === 3 || perf === 3) return 'bg-blue-100 border-blue-500 text-blue-700';
  return 'bg-yellow-100 border-yellow-500 text-yellow-700';
};

export default function AvaliacaoPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [tab, setTab] = useState('ciclos');

  // === Queries ===
  const { data: ciclos = [], isLoading: loadCiclos } = useQuery({ queryKey: ['ciclos_avaliacao', empresaAtual?.id], queryFn: () => avaliacaoService.listarCiclos(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: metas = [], isLoading: loadMetas } = useQuery({ queryKey: ['metas_okrs', empresaAtual?.id], queryFn: () => avaliacaoService.listarMetas(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: feedbacks = [], isLoading: loadFeedbacks } = useQuery({ queryKey: ['feedbacks_360', empresaAtual?.id], queryFn: () => avaliacaoService.listarFeedbacks(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: pdis = [], isLoading: loadPDIs } = useQuery({ queryKey: ['pdis', empresaAtual?.id], queryFn: () => avaliacaoService.listarPDIs(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: competencias = [], isLoading: loadComp } = useQuery({ queryKey: ['competencias', empresaAtual?.id], queryFn: () => avaliacaoService.listarCompetencias(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: nineBox = [], isLoading: loadNineBox } = useQuery({ 
    queryKey: ['nine_box', empresaAtual?.id], 
    queryFn: async () => {
      const { data, error } = await supabase.from('vw_matriz_nine_box' as any).select('*').eq('empresa_id', empresaAtual?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id 
  });
  const { data: colaboradores = [] } = useQuery({ queryKey: ['colaboradores', empresaAtual?.id], queryFn: () => colaboradorService.list(empresaAtual?.id), enabled: !!empresaAtual?.id });

  // === Ciclos ===
  const [openCiclo, setOpenCiclo] = useState(false);
  const [cicloForm, setCicloForm] = useState({ nome: '', descricao: '', data_inicio: '', data_fim: '', tipo: 'anual' });
  const criarCiclo = useMutation({
    mutationFn: () => avaliacaoService.criarCiclo({ ...cicloForm, empresa_id: empresaAtual?.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ciclos_avaliacao'] }); setOpenCiclo(false); setCicloForm({ nome: '', descricao: '', data_inicio: '', data_fim: '', tipo: 'anual' }); toast.success('Ciclo criado!'); },
    onError: () => toast.error('Erro ao criar ciclo'),
  });
  const excluirCiclo = useMutation({ mutationFn: (id: string) => avaliacaoService.excluirCiclo(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['ciclos_avaliacao'] }); toast.success('Ciclo excluído'); } });

  // === Metas ===
  const [openMeta, setOpenMeta] = useState(false);
  const [metaForm, setMetaForm] = useState({ titulo: '', descricao: '', colaborador_id: '', tipo: 'individual', data_limite: '' });
  const criarMeta = useMutation({
    mutationFn: () => avaliacaoService.criarMeta({ ...metaForm, empresa_id: empresaAtual?.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metas_okrs'] }); setOpenMeta(false); setMetaForm({ titulo: '', descricao: '', colaborador_id: '', tipo: 'individual', data_limite: '' }); toast.success('Meta criada!'); },
    onError: () => toast.error('Erro ao criar meta'),
  });
  const excluirMeta = useMutation({ mutationFn: (id: string) => avaliacaoService.excluirMeta(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['metas_okrs'] }); toast.success('Meta excluída'); } });

  // === Feedbacks ===
  const [openFeedback, setOpenFeedback] = useState(false);
  const [fbForm, setFbForm] = useState({ avaliado_id: '', avaliador_id: '', tipo: 'par', nota_geral: '', pontos_fortes: '', pontos_melhoria: '', performance: '3', potencial: '3' });
  const criarFeedback = useMutation({
    mutationFn: () => avaliacaoService.criarFeedback({ 
      ...fbForm, 
      nota_geral: fbForm.nota_geral ? Number(fbForm.nota_geral) : null, 
      performance: Number(fbForm.performance),
      potencial: Number(fbForm.potencial),
      empresa_id: empresaAtual?.id 
    } as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['feedbacks_360'] }); setOpenFeedback(false); setFbForm({ avaliado_id: '', avaliador_id: '', tipo: 'par', nota_geral: '', pontos_fortes: '', pontos_melhoria: '', performance: '3', potencial: '3' }); toast.success('Feedback registrado!'); },
    onError: () => toast.error('Erro ao registrar feedback'),
  });
  const excluirFeedback = useMutation({ mutationFn: (id: string) => avaliacaoService.excluirFeedback(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['feedbacks_360'] }); toast.success('Feedback excluído'); } });

  // === PDIs ===
  const [openPDI, setOpenPDI] = useState(false);
  const [pdiForm, setPdiForm] = useState({ titulo: '', descricao: '', colaborador_id: '', competencia: '', acao: '', prazo: '' });
  const criarPDI = useMutation({
    mutationFn: () => avaliacaoService.criarPDI({ ...pdiForm, empresa_id: empresaAtual?.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pdis'] }); setOpenPDI(false); setPdiForm({ titulo: '', descricao: '', colaborador_id: '', competencia: '', acao: '', prazo: '' }); toast.success('PDI criado!'); },
    onError: () => toast.error('Erro ao criar PDI'),
  });
  const excluirPDI = useMutation({ mutationFn: (id: string) => avaliacaoService.excluirPDI(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['pdis'] }); toast.success('PDI excluído'); } });

  // === Competências ===
  const [openComp, setOpenComp] = useState(false);
  const [compForm, setCompForm] = useState({ nome: '', descricao: '', categoria: '', nivel_esperado: '3' });
  const criarComp = useMutation({
    mutationFn: () => avaliacaoService.criarCompetencia({ ...compForm, nivel_esperado: Number(compForm.nivel_esperado), empresa_id: empresaAtual?.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['competencias'] }); setOpenComp(false); setCompForm({ nome: '', descricao: '', categoria: '', nivel_esperado: '3' }); toast.success('Competência criada!'); },
    onError: () => toast.error('Erro ao criar competência'),
  });
  const excluirComp = useMutation({ mutationFn: (id: string) => avaliacaoService.excluirCompetencia(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['competencias'] }); toast.success('Competência excluída'); } });

  const isLoading = loadCiclos || loadMetas || loadFeedbacks || loadPDIs || loadComp;

  return (
    <>
    <PageTitle title="Desempenho & OKRs" description="Gestão estratégica de pessoas" />
    <PageLayout 
      title="Avaliação de Desempenho" 
      description="Ciclos, metas, feedback 360° e PDI" 
      icon={<Target className="h-5 w-5 text-primary-foreground" />} 
      gradient="from-warning to-primary"
    >
      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="ciclos" className="rounded-lg gap-2"><BarChart2 className="h-4 w-4" /> Ciclos</TabsTrigger>
          <TabsTrigger value="metas" className="rounded-lg gap-2"><Target className="h-4 w-4" /> Metas & OKRs</TabsTrigger>
          <TabsTrigger value="feedbacks" className="rounded-lg gap-2"><Users className="h-4 w-4" /> Feedbacks</TabsTrigger>
          <TabsTrigger value="pdis" className="rounded-lg gap-2"><TrendingUp className="h-4 w-4" /> PDI</TabsTrigger>
          <TabsTrigger value="ninebox" className="rounded-lg gap-2"><LayoutGrid className="h-4 w-4" /> Nine-Box</TabsTrigger>
          <TabsTrigger value="auditoria" className="rounded-lg gap-2"><History className="h-4 w-4" /> Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="ciclos" className="space-y-6">
          <PerformanceDashboard 
             stats={{ ciclos: ciclos.length, metas: metas.length, feedbacks: feedbacks.length, pdis: pdis.length, competencias: competencias.length }}
             feedbacks={feedbacks}
             metas={metas}
          />

            <div className="flex justify-end mb-4">
              <Dialog open={openCiclo} onOpenChange={setOpenCiclo}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Novo Ciclo</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Novo Ciclo de Avaliação</DialogTitle></DialogHeader>
                  <div className="grid gap-3">
                    <div><Label>Nome *</Label><Input value={cicloForm.nome} onChange={e => setCicloForm(p => ({ ...p, nome: e.target.value }))} /></div>
                    <div><Label>Tipo</Label>
                      <Select value={cicloForm.tipo} onValueChange={v => setCicloForm(p => ({ ...p, tipo: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="anual">Anual</SelectItem><SelectItem value="semestral">Semestral</SelectItem><SelectItem value="trimestral">Trimestral</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label>Início *</Label><Input type="date" value={cicloForm.data_inicio} onChange={e => setCicloForm(p => ({ ...p, data_inicio: e.target.value }))} /></div>
                      <div><Label>Fim *</Label><Input type="date" value={cicloForm.data_fim} onChange={e => setCicloForm(p => ({ ...p, data_fim: e.target.value }))} /></div>
                    </div>
                    <div><Label>Descrição</Label><Textarea value={cicloForm.descricao} onChange={e => setCicloForm(p => ({ ...p, descricao: e.target.value }))} /></div>
                    <Button onClick={() => criarCiclo.mutate()} disabled={!cicloForm.nome || !cicloForm.data_inicio || !cicloForm.data_fim || criarCiclo.isPending}>{criarCiclo.isPending ? 'Salvando...' : 'Salvar'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-display font-semibold">Ciclo de Avaliação</TableHead>
                    <TableHead className="font-display font-semibold">Tipo</TableHead>
                    <TableHead className="font-display font-semibold">Período</TableHead>
                    <TableHead className="font-display font-semibold">Status</TableHead>
                    <TableHead className="text-right font-display font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ciclos.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12">Nenhum ciclo de desempenho configurado</TableCell></TableRow> :
                    ciclos.map((c: any) => (
                      <TableRow key={c.id} className="hover:bg-accent/30 transition-colors group">
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="font-body font-bold text-sm">{c.nome}</span>
                              <span className="text-[10px] text-muted-foreground truncate max-w-[250px]">{c.descricao}</span>
                           </div>
                        </TableCell>
                        <TableCell className="capitalize text-xs font-body">{c.tipo}</TableCell>
                        <TableCell className="text-xs font-body text-muted-foreground">
                           <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(c.data_inicio).toLocaleDateString('pt-BR')} → {new Date(c.data_fim).toLocaleDateString('pt-BR')}
                           </div>
                        </TableCell>
                        <TableCell><Badge variant={(statusColors[c.status] || 'secondary') as any} className="text-[10px]">{c.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => excluirCiclo.mutate(c.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>

          </TabsContent>

          {/* METAS */}
          <TabsContent value="metas">
            <div className="flex justify-end mb-4">
              <Dialog open={openMeta} onOpenChange={setOpenMeta}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Nova Meta</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nova Meta / OKR</DialogTitle></DialogHeader>
                  <div className="grid gap-3">
                    <div><Label>Título *</Label><Input value={metaForm.titulo} onChange={e => setMetaForm(p => ({ ...p, titulo: e.target.value }))} /></div>
                    <div><Label>Colaborador</Label>
                      <Select value={metaForm.colaborador_id} onValueChange={v => setMetaForm(p => ({ ...p, colaborador_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label>Tipo</Label>
                        <Select value={metaForm.tipo} onValueChange={v => setMetaForm(p => ({ ...p, tipo: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="individual">Individual</SelectItem><SelectItem value="equipe">Equipe</SelectItem><SelectItem value="empresa">Empresa</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div><Label>Prazo</Label><Input type="date" value={metaForm.data_limite} onChange={e => setMetaForm(p => ({ ...p, data_limite: e.target.value }))} /></div>
                    </div>
                    <div><Label>Descrição</Label><Textarea value={metaForm.descricao} onChange={e => setMetaForm(p => ({ ...p, descricao: e.target.value }))} /></div>
                    <Button onClick={() => criarMeta.mutate()} disabled={!metaForm.titulo || criarMeta.isPending}>{criarMeta.isPending ? 'Salvando...' : 'Salvar'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-display font-semibold">Meta / OKR</TableHead>
                    <TableHead className="font-display font-semibold">Responsável</TableHead>
                    <TableHead className="font-display font-semibold">Tipo</TableHead>
                    <TableHead className="font-display font-semibold">Progresso</TableHead>
                    <TableHead className="font-display font-semibold">Status</TableHead>
                    <TableHead className="text-right font-display font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metas.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Nenhuma meta estratégica definida</TableCell></TableRow> :
                    metas.map((m: any) => (
                      <TableRow key={m.id} className="hover:bg-accent/30 transition-colors group">
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="font-body font-bold text-sm">{m.titulo}</span>
                              <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">{m.descricao}</span>
                           </div>
                        </TableCell>
                        <TableCell className="font-body text-xs">{m.colaborador?.nome_completo || '—'}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize text-[10px]">{m.tipo}</Badge></TableCell>
                        <TableCell className="w-[150px]">
                           <div className="flex items-center gap-2">
                              <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                                 <div className="h-full bg-primary" style={{ width: `${m.progresso ?? 0}%` }} />
                              </div>
                              <span className="text-[10px] font-mono font-bold">{m.progresso ?? 0}%</span>
                           </div>
                        </TableCell>
                        <TableCell><Badge variant={(statusColors[m.status] || 'secondary') as any} className="text-[10px]">{m.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => excluirMeta.mutate(m.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>

          </TabsContent>

          {/* FEEDBACKS */}
          <TabsContent value="feedbacks">
            <div className="flex justify-end mb-4">
              <Dialog open={openFeedback} onOpenChange={setOpenFeedback}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Novo Feedback</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Novo Feedback 360°</DialogTitle></DialogHeader>
                  <div className="grid gap-3">
                    <div><Label>Avaliado *</Label>
                      <Select value={fbForm.avaliado_id} onValueChange={v => setFbForm(p => ({ ...p, avaliado_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Avaliador *</Label>
                      <Select value={fbForm.avaliador_id} onValueChange={v => setFbForm(p => ({ ...p, avaliador_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label>Tipo</Label>
                        <Select value={fbForm.tipo} onValueChange={v => setFbForm(p => ({ ...p, tipo: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="par">Par</SelectItem><SelectItem value="gestor">Gestor</SelectItem><SelectItem value="subordinado">Subordinado</SelectItem><SelectItem value="autoavaliacao">Autoavaliação</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div><Label>Nota (0-10)</Label><Input type="number" min="0" max="10" value={fbForm.nota_geral} onChange={e => setFbForm(p => ({ ...p, nota_geral: e.target.value }))} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label>Performance (1-5)</Label>
                        <Select value={fbForm.performance} onValueChange={v => setFbForm(p => ({ ...p, performance: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div><Label>Potencial (1-5)</Label>
                        <Select value={fbForm.potencial} onValueChange={v => setFbForm(p => ({ ...p, potencial: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div><Label>Pontos Fortes</Label><Textarea value={fbForm.pontos_fortes} onChange={e => setFbForm(p => ({ ...p, pontos_fortes: e.target.value }))} /></div>
                    <div><Label>Pontos de Melhoria</Label><Textarea value={fbForm.pontos_melhoria} onChange={e => setFbForm(p => ({ ...p, pontos_melhoria: e.target.value }))} /></div>
                    <Button onClick={() => criarFeedback.mutate()} disabled={!fbForm.avaliado_id || !fbForm.avaliador_id || criarFeedback.isPending}>{criarFeedback.isPending ? 'Salvando...' : 'Salvar'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-display font-semibold">Colaborador</TableHead>
                    <TableHead className="font-display font-semibold">Avaliador</TableHead>
                    <TableHead className="font-display font-semibold">Relação</TableHead>
                    <TableHead className="font-display font-semibold text-center">Nota</TableHead>
                    <TableHead className="font-display font-semibold">Status</TableHead>
                    <TableHead className="text-right font-display font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Nenhum feedback registrado no período</TableCell></TableRow> :
                    feedbacks.map((f: any) => (
                      <TableRow key={f.id} className="hover:bg-accent/30 transition-colors group">
                        <TableCell className="font-body font-bold text-sm">{f.avaliado?.nome_completo || '—'}</TableCell>
                        <TableCell className="font-body text-xs text-muted-foreground">{f.avaliador?.nome_completo || '—'}</TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize text-[9px]">{f.tipo}</Badge></TableCell>
                        <TableCell className="text-center">
                           <div className="flex items-center justify-center gap-1">
                              <Star className="h-3 w-3 text-warning fill-warning" />
                              <span className="font-mono font-bold">{f.nota_geral ?? '—'}</span>
                           </div>
                        </TableCell>
                        <TableCell><Badge variant={(statusColors[f.status] || 'secondary') as any} className="text-[10px]">{f.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => excluirFeedback.mutate(f.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>

          </TabsContent>

          {/* PDIs */}
          <TabsContent value="pdis">
            <div className="flex justify-end mb-4">
              <Dialog open={openPDI} onOpenChange={setOpenPDI}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Novo PDI</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Novo PDI</DialogTitle></DialogHeader>
                  <div className="grid gap-3">
                    <div><Label>Título *</Label><Input value={pdiForm.titulo} onChange={e => setPdiForm(p => ({ ...p, titulo: e.target.value }))} /></div>
                    <div><Label>Colaborador *</Label>
                      <Select value={pdiForm.colaborador_id} onValueChange={v => setPdiForm(p => ({ ...p, colaborador_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Competência</Label><Input value={pdiForm.competencia} onChange={e => setPdiForm(p => ({ ...p, competencia: e.target.value }))} /></div>
                    <div><Label>Ação</Label><Textarea value={pdiForm.acao} onChange={e => setPdiForm(p => ({ ...p, acao: e.target.value }))} /></div>
                    <div><Label>Prazo</Label><Input type="date" value={pdiForm.prazo} onChange={e => setPdiForm(p => ({ ...p, prazo: e.target.value }))} /></div>
                    <Button onClick={() => criarPDI.mutate()} disabled={!pdiForm.titulo || !pdiForm.colaborador_id || criarPDI.isPending}>{criarPDI.isPending ? 'Salvando...' : 'Salvar'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-display font-semibold">Título do PDI</TableHead>
                    <TableHead className="font-display font-semibold">Colaborador</TableHead>
                    <TableHead className="font-display font-semibold">Foco / Competência</TableHead>
                    <TableHead className="font-display font-semibold text-center">Progresso</TableHead>
                    <TableHead className="font-display font-semibold">Status</TableHead>
                    <TableHead className="text-right font-display font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pdis.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Nenhum Plano de Desenvolvimento cadastrado</TableCell></TableRow> :
                    pdis.map((p: any) => (
                      <TableRow key={p.id} className="hover:bg-accent/30 transition-colors group">
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="font-body font-bold text-sm">{p.titulo}</span>
                              <span className="text-[10px] text-muted-foreground italic">Prazo: {p.prazo ? new Date(p.prazo).toLocaleDateString('pt-BR') : '—'}</span>
                           </div>
                        </TableCell>
                        <TableCell className="font-body text-xs">{p.colaborador?.nome_completo || '—'}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[9px] uppercase">{p.competencia || 'Geral'}</Badge></TableCell>
                        <TableCell className="w-[120px]">
                           <div className="flex items-center gap-2">
                              <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500" style={{ width: `${p.progresso ?? 0}%` }} />
                              </div>
                              <span className="text-[9px] font-mono font-bold">{p.progresso ?? 0}%</span>
                           </div>
                        </TableCell>
                        <TableCell><Badge variant={(statusColors[p.status] || 'secondary') as any} className="text-[10px]">{p.status}</Badge></TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 text-primary" onClick={() => gerarPDIPDF(p.colaborador?.nome_completo || 'Colaborador', p)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => excluirPDI.mutate(p.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>

          </TabsContent>

          {/* COMPETÊNCIAS */}
          <TabsContent value="competencias">
            <div className="flex justify-end mb-4">
              <Dialog open={openComp} onOpenChange={setOpenComp}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Nova Competência</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nova Competência</DialogTitle></DialogHeader>
                  <div className="grid gap-3">
                    <div><Label>Nome *</Label><Input value={compForm.nome} onChange={e => setCompForm(p => ({ ...p, nome: e.target.value }))} /></div>
                    <div><Label>Categoria</Label><Input value={compForm.categoria} onChange={e => setCompForm(p => ({ ...p, categoria: e.target.value }))} placeholder="Ex: Técnica, Comportamental" /></div>
                    <div><Label>Nível Esperado (1-5)</Label><Input type="number" min="1" max="5" value={compForm.nivel_esperado} onChange={e => setCompForm(p => ({ ...p, nivel_esperado: e.target.value }))} /></div>
                    <div><Label>Descrição</Label><Textarea value={compForm.descricao} onChange={e => setCompForm(p => ({ ...p, descricao: e.target.value }))} /></div>
                    <Button onClick={() => criarComp.mutate()} disabled={!compForm.nome || criarComp.isPending}>{criarComp.isPending ? 'Salvando...' : 'Salvar'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-display font-semibold">Competência</TableHead>
                    <TableHead className="font-display font-semibold">Categoria</TableHead>
                    <TableHead className="font-display font-semibold text-center">Nível Esperado</TableHead>
                    <TableHead className="text-right font-display font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competencias.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">Nenhuma competência técnica ou comportamental mapeada</TableCell></TableRow> :
                    competencias.map((c: any) => (
                      <TableRow key={c.id} className="hover:bg-accent/30 transition-colors group">
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="font-body font-bold text-sm">{c.nome}</span>
                              <span className="text-[10px] text-muted-foreground">{c.descricao}</span>
                           </div>
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="text-[9px] uppercase tracking-wider">{c.categoria || 'Geral'}</Badge></TableCell>
                        <TableCell className="text-center">
                           <div className="flex items-center justify-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                 <div key={i} className={`h-1.5 w-3 rounded-full ${i < c.nivel_esperado ? 'bg-primary' : 'bg-muted'}`} />
                              ))}
                              <span className="text-[10px] font-mono font-bold ml-1">{c.nivel_esperado}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => excluirComp.mutate(c.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>

          </TabsContent>
          
          {/* NINE BOX */}
          <TabsContent value="ninebox">
            {loadNineBox ? <div className="p-12 flex justify-center"><Spinner /></div> : (
              <NineBoxMatrix data={nineBox} />
            )}
          </TabsContent>

          <TabsContent value="auditoria">
            <PerformanceAuditTimeline />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
}

