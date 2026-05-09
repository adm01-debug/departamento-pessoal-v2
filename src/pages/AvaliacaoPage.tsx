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
import { Target, Plus, ClipboardList, Users, TrendingUp, Star, Trash2 } from 'lucide-react';

const statusColors: Record<string, string> = { rascunho: 'secondary', ativo: 'default', finalizado: 'outline', pendente: 'secondary', em_andamento: 'default', concluido: 'outline' };

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
    <PageTitle title="Avaliação" description="Avaliação de desempenho" />
    <PageLayout title="Avaliação de Desempenho" description="Ciclos, metas, feedback 360° e PDI" icon={<Target className="h-5 w-5 text-primary-foreground" />} gradient="from-warning to-primary">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card><CardContent className="pt-4 text-center"><ClipboardList className="h-6 w-6 mx-auto text-primary mb-1" /><p className="text-2xl font-bold">{ciclos.length}</p><p className="text-xs text-muted-foreground">Ciclos</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><Target className="h-6 w-6 mx-auto text-success mb-1" /><p className="text-2xl font-bold">{metas.length}</p><p className="text-xs text-muted-foreground">Metas</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><Users className="h-6 w-6 mx-auto text-info mb-1" /><p className="text-2xl font-bold">{feedbacks.length}</p><p className="text-xs text-muted-foreground">Feedbacks</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><TrendingUp className="h-6 w-6 mx-auto text-warning mb-1" /><p className="text-2xl font-bold">{pdis.length}</p><p className="text-xs text-muted-foreground">PDIs</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><Star className="h-6 w-6 mx-auto text-destructive mb-1" /><p className="text-2xl font-bold">{competencias.length}</p><p className="text-xs text-muted-foreground">Competências</p></CardContent></Card>
      </div>

      {isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="ciclos">Ciclos</TabsTrigger>
            <TabsTrigger value="metas">Metas & OKRs</TabsTrigger>
            <TabsTrigger value="feedbacks">Feedback 360°</TabsTrigger>
            <TabsTrigger value="pdis">PDI</TabsTrigger>
            <TabsTrigger value="competencias">Competências</TabsTrigger>
          </TabsList>

          {/* CICLOS */}
          <TabsContent value="ciclos">
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
            <Card><CardContent className="p-0">
              <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Período</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {ciclos.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum ciclo cadastrado</TableCell></TableRow> :
                    ciclos.map((c: any) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.nome}</TableCell>
                        <TableCell>{c.tipo}</TableCell>
                        <TableCell>{c.data_inicio} → {c.data_fim}</TableCell>
                        <TableCell><Badge variant={(statusColors[c.status] || 'secondary') as any}>{c.status}</Badge></TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => excluirCiclo.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent></Card>
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
            <Card><CardContent className="p-0">
              <Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Progresso</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {metas.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhuma meta cadastrada</TableCell></TableRow> :
                    metas.map((m: any) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.titulo}</TableCell>
                        <TableCell>{m.colaborador?.nome_completo || '—'}</TableCell>
                        <TableCell>{m.tipo}</TableCell>
                        <TableCell>{m.progresso ?? 0}%</TableCell>
                        <TableCell><Badge variant={(statusColors[m.status] || 'secondary') as any}>{m.status}</Badge></TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => excluirMeta.mutate(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent></Card>
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
            <Card><CardContent className="p-0">
              <Table><TableHeader><TableRow><TableHead>Avaliado</TableHead><TableHead>Avaliador</TableHead><TableHead>Tipo</TableHead><TableHead>Nota</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {feedbacks.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum feedback registrado</TableCell></TableRow> :
                    feedbacks.map((f: any) => (
                      <TableRow key={f.id}>
                        <TableCell>{f.avaliado?.nome_completo || '—'}</TableCell>
                        <TableCell>{f.avaliador?.nome_completo || '—'}</TableCell>
                        <TableCell>{f.tipo}</TableCell>
                        <TableCell>{f.nota_geral ?? '—'}</TableCell>
                        <TableCell><Badge variant={(statusColors[f.status] || 'secondary') as any}>{f.status}</Badge></TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => excluirFeedback.mutate(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent></Card>
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
            <Card><CardContent className="p-0">
              <Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Colaborador</TableHead><TableHead>Competência</TableHead><TableHead>Progresso</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {pdis.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum PDI cadastrado</TableCell></TableRow> :
                    pdis.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.titulo}</TableCell>
                        <TableCell>{p.colaborador?.nome_completo || '—'}</TableCell>
                        <TableCell>{p.competencia || '—'}</TableCell>
                        <TableCell>{p.progresso ?? 0}%</TableCell>
                        <TableCell><Badge variant={(statusColors[p.status] || 'secondary') as any}>{p.status}</Badge></TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => excluirPDI.mutate(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent></Card>
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
            <Card><CardContent className="p-0">
              <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Categoria</TableHead><TableHead>Nível Esperado</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {competencias.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhuma competência cadastrada</TableCell></TableRow> :
                    competencias.map((c: any) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.nome}</TableCell>
                        <TableCell>{c.categoria || '—'}</TableCell>
                        <TableCell>{c.nivel_esperado}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => excluirComp.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      )}
    </PageLayout>
    </>
  );
}
