import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { colaboradorService } from '@/services';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  ArrowLeft, Plus, Trash2, Users, Phone, DollarSign, Stethoscope,
  GraduationCap, Globe, Accessibility, FileText, Calendar, StickyNote, Shield
} from 'lucide-react';
import {
  useDependentes, useCriarDependente, useExcluirDependente,
  useContatosEmergencia, useCriarContatoEmergencia,
  useHistoricoSalarial, useCriarRegistroSalarial,
  useASOs, useCriarASO,
  useFormacoes, useCriarFormacao,
  useDadosEstrangeiro, useSalvarDadosEstrangeiro,
  useDeficiencia, useSalvarDeficiencia,
  usePeriodoExperiencia, useSalvarPeriodoExperiencia,
  useAnotacoes, useCriarAnotacao,
  usePeriodosAquisitivos,
} from '@/hooks/useColaboradorDetalhes';

export default function ColaboradorDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: colaborador, isLoading } = useQuery({
    queryKey: ['colaborador', id],
    queryFn: () => colaboradorService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;
  if (!colaborador) return <div className="p-6">Colaborador não encontrado</div>;

  return (
    <PageLayout title={`${colaborador.nome_completo} — ${colaborador.cargo} · ${colaborador.departamento}`}>
      <Button variant="ghost" size="sm" onClick={() => navigate('/colaboradores')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <Badge variant={colaborador.status === 'ativo' ? 'default' : 'secondary'}>
          {colaborador.status}
        </Badge>
        <span className="text-sm text-muted-foreground">CPF: {colaborador.cpf}</span>
        <span className="text-sm text-muted-foreground">Admissão: {colaborador.data_admissao}</span>
        <span className="text-sm text-muted-foreground">
          Salário: {Number(colaborador.salario_base).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>

      <Tabs defaultValue="dependentes" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="dependentes" className="text-xs"><Users className="mr-1 h-3 w-3" />Dependentes</TabsTrigger>
          <TabsTrigger value="emergencia" className="text-xs"><Phone className="mr-1 h-3 w-3" />Emergência</TabsTrigger>
          <TabsTrigger value="historico" className="text-xs"><DollarSign className="mr-1 h-3 w-3" />Hist. Salarial</TabsTrigger>
          <TabsTrigger value="experiencia" className="text-xs"><Calendar className="mr-1 h-3 w-3" />Experiência</TabsTrigger>
          <TabsTrigger value="aso" className="text-xs"><Stethoscope className="mr-1 h-3 w-3" />ASO</TabsTrigger>
          <TabsTrigger value="formacao" className="text-xs"><GraduationCap className="mr-1 h-3 w-3" />Formação</TabsTrigger>
          <TabsTrigger value="estrangeiro" className="text-xs"><Globe className="mr-1 h-3 w-3" />Estrangeiro</TabsTrigger>
          <TabsTrigger value="pcd" className="text-xs"><Accessibility className="mr-1 h-3 w-3" />PCD</TabsTrigger>
          <TabsTrigger value="aquisitivos" className="text-xs"><Calendar className="mr-1 h-3 w-3" />Per. Aquisitivos</TabsTrigger>
          <TabsTrigger value="anotacoes" className="text-xs"><StickyNote className="mr-1 h-3 w-3" />Anotações</TabsTrigger>
        </TabsList>

        <TabsContent value="dependentes"><DependentesTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="emergencia"><EmergenciaTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="historico"><HistoricoSalarialTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="experiencia"><ExperienciaTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="aso"><ASOTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="formacao"><FormacaoTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="estrangeiro"><EstrangeiroTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="pcd"><PCDTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="aquisitivos"><AquisitivosTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="anotacoes"><AnotacoesTab colaboradorId={id!} /></TabsContent>
      </Tabs>
    </PageLayout>
  );
}

// ============ Dependentes Tab ============
function DependentesTab({ colaboradorId }: { colaboradorId: string }) {
  const { data, isLoading } = useDependentes(colaboradorId);
  const criar = useCriarDependente();
  const excluir = useExcluirDependente(colaboradorId);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', parentesco: '', cpf: '', data_nascimento: '', ir: false, salario_familia: false });

  const handleSubmit = async () => {
    try {
      await criar.mutateAsync({ ...form, colaborador_id: colaboradorId } as any);
      toast.success('Dependente adicionado');
      setOpen(false);
      setForm({ nome: '', parentesco: '', cpf: '', data_nascimento: '', ir: false, salario_familia: false });
    } catch { toast.error('Erro ao adicionar dependente'); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Dependentes</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" />Adicionar</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Dependente</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Nome *</Label><Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></div>
              <div><Label>Parentesco *</Label>
                <Select value={form.parentesco} onValueChange={v => setForm(f => ({ ...f, parentesco: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {['Cônjuge','Filho(a)','Enteado(a)','Pai/Mãe','Irmão/Irmã','Avô/Avó','Neto(a)','Tutelado(a)','Outro'].map(p =>
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>CPF</Label><Input value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} /></div>
              <div><Label>Data Nascimento</Label><Input type="date" value={form.data_nascimento} onChange={e => setForm(f => ({ ...f, data_nascimento: e.target.value }))} /></div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.ir} onChange={e => setForm(f => ({ ...f, ir: e.target.checked }))} />IRRF</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.salario_familia} onChange={e => setForm(f => ({ ...f, salario_familia: e.target.checked }))} />Salário Família</label>
              </div>
              <Button onClick={handleSubmit} disabled={criar.isPending}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : !data?.length ? <p className="text-sm text-muted-foreground">Nenhum dependente cadastrado.</p> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Nome</TableHead><TableHead>Parentesco</TableHead><TableHead>CPF</TableHead><TableHead>IRRF</TableHead><TableHead>Sal. Família</TableHead><TableHead />
            </TableRow></TableHeader>
            <TableBody>
              {data.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell>{d.nome}</TableCell>
                  <TableCell>{d.parentesco}</TableCell>
                  <TableCell>{d.cpf || '-'}</TableCell>
                  <TableCell>{d.ir ? <Badge>Sim</Badge> : 'Não'}</TableCell>
                  <TableCell>{d.salario_familia ? <Badge>Sim</Badge> : 'Não'}</TableCell>
                  <TableCell><Button variant="ghost" size="sm" onClick={() => excluir.mutate(d.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ============ Contatos Emergência Tab ============
function EmergenciaTab({ colaboradorId }: { colaboradorId: string }) {
  const { data, isLoading } = useContatosEmergencia(colaboradorId);
  const criar = useCriarContatoEmergencia();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', parentesco: '', telefone: '', celular: '', email: '' });

  const handleSubmit = async () => {
    try {
      await criar.mutateAsync({ ...form, colaborador_id: colaboradorId });
      toast.success('Contato adicionado');
      setOpen(false);
      setForm({ nome: '', parentesco: '', telefone: '', celular: '', email: '' });
    } catch { toast.error('Erro ao adicionar contato'); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Contatos de Emergência</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" />Adicionar</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Contato de Emergência</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Nome *</Label><Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></div>
              <div><Label>Parentesco</Label>
                <Select value={form.parentesco} onValueChange={v => setForm(f => ({ ...f, parentesco: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {['Pai/Mãe','Cônjuge','Irmão/Irmã','Filho(a)','Amigo(a)','Outro'].map(p =>
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Telefone</Label><Input value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} /></div>
              <div><Label>Celular</Label><Input value={form.celular} onChange={e => setForm(f => ({ ...f, celular: e.target.value }))} /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <Button onClick={handleSubmit} disabled={criar.isPending}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : !data?.length ? <p className="text-sm text-muted-foreground">Nenhum contato cadastrado.</p> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Nome</TableHead><TableHead>Parentesco</TableHead><TableHead>Telefone</TableHead><TableHead>Celular</TableHead><TableHead>Email</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {data.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell>{c.nome}</TableCell><TableCell>{c.parentesco || '-'}</TableCell>
                  <TableCell>{c.telefone || '-'}</TableCell><TableCell>{c.celular || '-'}</TableCell>
                  <TableCell>{c.email || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ============ Histórico Salarial Tab ============
function HistoricoSalarialTab({ colaboradorId }: { colaboradorId: string }) {
  const { data, isLoading } = useHistoricoSalarial(colaboradorId);
  const criar = useCriarRegistroSalarial();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ salario_novo: '', motivo: '', data_vigencia: '', descricao: '' });

  const handleSubmit = async () => {
    try {
      await criar.mutateAsync({ ...form, salario_novo: Number(form.salario_novo), colaborador_id: colaboradorId });
      toast.success('Registro salarial adicionado');
      setOpen(false);
    } catch { toast.error('Erro ao registrar alteração'); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Histórico Salarial</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" />Nova Alteração</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar Alteração Salarial</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Novo Salário *</Label><Input type="number" step="0.01" value={form.salario_novo} onChange={e => setForm(f => ({ ...f, salario_novo: e.target.value }))} /></div>
              <div><Label>Motivo *</Label>
                <Select value={form.motivo} onValueChange={v => setForm(f => ({ ...f, motivo: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {['Promoção','Mérito','Enquadramento','Dissídio coletivo','Acordo coletivo','Transferência','Outro'].map(m =>
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Data Vigência *</Label><Input type="date" value={form.data_vigencia} onChange={e => setForm(f => ({ ...f, data_vigencia: e.target.value }))} /></div>
              <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} /></div>
              <Button onClick={handleSubmit} disabled={criar.isPending}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : !data?.length ? <p className="text-sm text-muted-foreground">Nenhum registro encontrado.</p> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Data</TableHead><TableHead>Salário Anterior</TableHead><TableHead>Novo Salário</TableHead><TableHead>Motivo</TableHead><TableHead>Descrição</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {data.map((h: any) => (
                <TableRow key={h.id}>
                  <TableCell>{h.data_vigencia}</TableCell>
                  <TableCell>{h.salario_anterior ? Number(h.salario_anterior).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</TableCell>
                  <TableCell className="font-semibold">{Number(h.salario_novo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell><Badge variant="outline">{h.motivo}</Badge></TableCell>
                  <TableCell>{h.descricao || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ============ Período de Experiência Tab ============
function ExperienciaTab({ colaboradorId }: { colaboradorId: string }) {
  const { data, isLoading } = usePeriodoExperiencia(colaboradorId);
  const salvar = useSalvarPeriodoExperiencia();
  const [form, setForm] = useState({ data_inicio: '', primeira_etapa_fim: '', segunda_etapa_fim: '', tipo: '45+45', dias_total: 90 });

  const handleSave = async () => {
    try {
      await salvar.mutateAsync({ colaboradorId, dados: form });
      toast.success('Período de experiência salvo');
    } catch { toast.error('Erro ao salvar'); }
  };

  if (isLoading) return <Spinner />;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Período de Experiência</CardTitle></CardHeader>
      <CardContent>
        {data ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><Label className="text-muted-foreground text-xs">Início</Label><p className="font-medium">{(data as any).data_inicio}</p></div>
            <div><Label className="text-muted-foreground text-xs">1ª Etapa (fim)</Label><p className="font-medium">{(data as any).primeira_etapa_fim || '-'}</p></div>
            <div><Label className="text-muted-foreground text-xs">2ª Etapa (fim)</Label><p className="font-medium">{(data as any).segunda_etapa_fim || '-'}</p></div>
            <div><Label className="text-muted-foreground text-xs">Tipo</Label><p className="font-medium">{(data as any).tipo}</p></div>
            <div><Label className="text-muted-foreground text-xs">Status</Label><Badge>{(data as any).status}</Badge></div>
          </div>
        ) : (
          <div className="grid gap-3 max-w-md">
            <p className="text-sm text-muted-foreground mb-2">Nenhum período cadastrado. Preencha abaixo:</p>
            <div><Label>Data Início</Label><Input type="date" value={form.data_inicio} onChange={e => setForm(f => ({ ...f, data_inicio: e.target.value }))} /></div>
            <div><Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="45+45">45 + 45 dias</SelectItem>
                  <SelectItem value="30+60">30 + 60 dias</SelectItem>
                  <SelectItem value="90">90 dias corridos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>1ª Etapa Fim</Label><Input type="date" value={form.primeira_etapa_fim} onChange={e => setForm(f => ({ ...f, primeira_etapa_fim: e.target.value }))} /></div>
            <div><Label>2ª Etapa Fim</Label><Input type="date" value={form.segunda_etapa_fim} onChange={e => setForm(f => ({ ...f, segunda_etapa_fim: e.target.value }))} /></div>
            <Button onClick={handleSave} disabled={salvar.isPending}>Salvar</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============ ASO Tab ============
function ASOTab({ colaboradorId }: { colaboradorId: string }) {
  const { data, isLoading } = useASOs(colaboradorId);
  const criar = useCriarASO();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ tipo: '', data_exame: '', resultado: 'apto', medico_nome: '', medico_crm: '', clinica: '', observacoes: '' });

  const handleSubmit = async () => {
    try {
      await criar.mutateAsync({ ...form, colaborador_id: colaboradorId });
      toast.success('ASO registrado');
      setOpen(false);
    } catch { toast.error('Erro ao registrar ASO'); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Atestados de Saúde Ocupacional</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" />Novo ASO</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar ASO</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Tipo *</Label>
                <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {['Admissional','Periódico','Retorno ao trabalho','Mudança de risco','Demissional'].map(t =>
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Data Exame *</Label><Input type="date" value={form.data_exame} onChange={e => setForm(f => ({ ...f, data_exame: e.target.value }))} /></div>
              <div><Label>Resultado</Label>
                <Select value={form.resultado} onValueChange={v => setForm(f => ({ ...f, resultado: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apto">Apto</SelectItem>
                    <SelectItem value="inapto">Inapto</SelectItem>
                    <SelectItem value="apto_com_restricao">Apto com Restrição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Médico</Label><Input value={form.medico_nome} onChange={e => setForm(f => ({ ...f, medico_nome: e.target.value }))} /></div>
              <div><Label>CRM</Label><Input value={form.medico_crm} onChange={e => setForm(f => ({ ...f, medico_crm: e.target.value }))} /></div>
              <div><Label>Clínica</Label><Input value={form.clinica} onChange={e => setForm(f => ({ ...f, clinica: e.target.value }))} /></div>
              <Button onClick={handleSubmit} disabled={criar.isPending}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : !data?.length ? <p className="text-sm text-muted-foreground">Nenhum ASO registrado.</p> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Tipo</TableHead><TableHead>Data</TableHead><TableHead>Resultado</TableHead><TableHead>Médico</TableHead><TableHead>Clínica</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {data.map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell><Badge variant="outline">{a.tipo}</Badge></TableCell>
                  <TableCell>{a.data_exame}</TableCell>
                  <TableCell><Badge variant={a.resultado === 'apto' ? 'default' : 'destructive'}>{a.resultado}</Badge></TableCell>
                  <TableCell>{a.medico_nome || '-'} {a.medico_crm ? `(CRM: ${a.medico_crm})` : ''}</TableCell>
                  <TableCell>{a.clinica || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ============ Formação Acadêmica Tab ============
function FormacaoTab({ colaboradorId }: { colaboradorId: string }) {
  const { data, isLoading } = useFormacoes(colaboradorId);
  const criar = useCriarFormacao();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ tipo_escolaridade: '', curso: '', instituicao: '', ano_conclusao: '' });

  const handleSubmit = async () => {
    try {
      await criar.mutateAsync({ ...form, ano_conclusao: form.ano_conclusao ? Number(form.ano_conclusao) : null, colaborador_id: colaboradorId });
      toast.success('Formação adicionada');
      setOpen(false);
    } catch { toast.error('Erro ao adicionar formação'); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Formação Acadêmica</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" />Adicionar</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Formação</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Escolaridade</Label>
                <Select value={form.tipo_escolaridade} onValueChange={v => setForm(f => ({ ...f, tipo_escolaridade: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {['Fundamental incompleto','Fundamental completo','Médio incompleto','Médio completo','Superior incompleto','Superior completo','Pós-graduação','Mestrado','Doutorado'].map(e =>
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Curso</Label><Input value={form.curso} onChange={e => setForm(f => ({ ...f, curso: e.target.value }))} /></div>
              <div><Label>Instituição</Label><Input value={form.instituicao} onChange={e => setForm(f => ({ ...f, instituicao: e.target.value }))} /></div>
              <div><Label>Ano Conclusão</Label><Input type="number" value={form.ano_conclusao} onChange={e => setForm(f => ({ ...f, ano_conclusao: e.target.value }))} /></div>
              <Button onClick={handleSubmit} disabled={criar.isPending}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : !data?.length ? <p className="text-sm text-muted-foreground">Nenhuma formação cadastrada.</p> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Escolaridade</TableHead><TableHead>Curso</TableHead><TableHead>Instituição</TableHead><TableHead>Ano</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {data.map((f: any) => (
                <TableRow key={f.id}>
                  <TableCell>{f.tipo_escolaridade || '-'}</TableCell>
                  <TableCell>{f.curso || '-'}</TableCell>
                  <TableCell>{f.instituicao || '-'}</TableCell>
                  <TableCell>{f.ano_conclusao || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ============ Estrangeiro Tab ============
function EstrangeiroTab({ colaboradorId }: { colaboradorId: string }) {
  const { data, isLoading } = useDadosEstrangeiro(colaboradorId);
  const salvar = useSalvarDadosEstrangeiro();
  const [form, setForm] = useState({ pais_origem: '', tipo_visto: '', data_chegada: '', reside_brasil: true });

  const handleSave = async () => {
    try {
      await salvar.mutateAsync({ colaboradorId, dados: form });
      toast.success('Dados salvos');
    } catch { toast.error('Erro ao salvar'); }
  };

  if (isLoading) return <Spinner />;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Dados de Estrangeiro</CardTitle></CardHeader>
      <CardContent>
        {data ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><Label className="text-xs text-muted-foreground">País de Origem</Label><p className="font-medium">{(data as any).pais_origem || '-'}</p></div>
            <div><Label className="text-xs text-muted-foreground">Tipo de Visto</Label><p className="font-medium">{(data as any).tipo_visto || '-'}</p></div>
            <div><Label className="text-xs text-muted-foreground">Data Chegada</Label><p className="font-medium">{(data as any).data_chegada || '-'}</p></div>
            <div><Label className="text-xs text-muted-foreground">Reside no Brasil</Label><Badge>{(data as any).reside_brasil ? 'Sim' : 'Não'}</Badge></div>
          </div>
        ) : (
          <div className="grid gap-3 max-w-md">
            <div><Label>País de Origem</Label><Input value={form.pais_origem} onChange={e => setForm(f => ({ ...f, pais_origem: e.target.value }))} /></div>
            <div><Label>Tipo de Visto</Label><Input value={form.tipo_visto} onChange={e => setForm(f => ({ ...f, tipo_visto: e.target.value }))} /></div>
            <div><Label>Data Chegada</Label><Input type="date" value={form.data_chegada} onChange={e => setForm(f => ({ ...f, data_chegada: e.target.value }))} /></div>
            <Button onClick={handleSave} disabled={salvar.isPending}>Salvar</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============ PCD Tab ============
function PCDTab({ colaboradorId }: { colaboradorId: string }) {
  const { data, isLoading } = useDeficiencia(colaboradorId);
  const salvar = useSalvarDeficiencia();
  const [form, setForm] = useState({ tipo: '', cid: '', descricao: '', observacoes: '' });

  const handleSave = async () => {
    try {
      await salvar.mutateAsync({ colaboradorId, dados: form });
      toast.success('Dados PCD salvos');
    } catch { toast.error('Erro ao salvar'); }
  };

  if (isLoading) return <Spinner />;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Pessoa com Deficiência (PCD)</CardTitle></CardHeader>
      <CardContent>
        {data ? (
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs text-muted-foreground">Tipo</Label><p className="font-medium">{(data as any).tipo}</p></div>
            <div><Label className="text-xs text-muted-foreground">CID</Label><p className="font-medium">{(data as any).cid || '-'}</p></div>
            <div className="col-span-2"><Label className="text-xs text-muted-foreground">Descrição</Label><p>{(data as any).descricao || '-'}</p></div>
          </div>
        ) : (
          <div className="grid gap-3 max-w-md">
            <div><Label>Tipo de Deficiência *</Label>
              <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {['Física','Auditiva','Visual','Mental','Intelectual','Múltipla','Reabilitado'].map(t =>
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div><Label>CID</Label><Input value={form.cid} onChange={e => setForm(f => ({ ...f, cid: e.target.value }))} /></div>
            <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} /></div>
            <Button onClick={handleSave} disabled={salvar.isPending}>Salvar</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============ Períodos Aquisitivos Tab ============
function AquisitivosTab({ colaboradorId }: { colaboradorId: string }) {
  const { data, isLoading } = usePeriodosAquisitivos(colaboradorId);

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Períodos Aquisitivos de Férias</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : !data?.length ? <p className="text-sm text-muted-foreground">Nenhum período aquisitivo.</p> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Período Aquisitivo</TableHead><TableHead>Período Concessivo</TableHead><TableHead>Saldo</TableHead><TableHead>Faltas</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {data.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.inicio_aquisitivo} a {p.fim_aquisitivo}</TableCell>
                  <TableCell>{p.inicio_concessivo} a {p.fim_concessivo}</TableCell>
                  <TableCell className="font-semibold">{p.saldo_atual} dias</TableCell>
                  <TableCell>{p.faltas_periodo}</TableCell>
                  <TableCell><Badge variant={p.status === 'vencido' ? 'destructive' : 'default'}>{p.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ============ Anotações Tab ============
function AnotacoesTab({ colaboradorId }: { colaboradorId: string }) {
  const { data, isLoading } = useAnotacoes(colaboradorId);
  const criar = useCriarAnotacao();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: '', conteudo: '', tipo: 'geral' });

  const handleSubmit = async () => {
    try {
      await criar.mutateAsync({ ...form, colaborador_id: colaboradorId });
      toast.success('Anotação adicionada');
      setOpen(false);
      setForm({ titulo: '', conteudo: '', tipo: 'geral' });
    } catch { toast.error('Erro ao adicionar anotação'); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Anotações</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" />Nova Anotação</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Anotação</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Título *</Label><Input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} /></div>
              <div><Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['geral','advertencia','elogio','feedback','disciplinar','outro'].map(t =>
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Conteúdo</Label><Textarea rows={4} value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} /></div>
              <Button onClick={handleSubmit} disabled={criar.isPending}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : !data?.length ? <p className="text-sm text-muted-foreground">Nenhuma anotação.</p> : (
          <div className="space-y-3">
            {data.map((a: any) => (
              <div key={a.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{a.titulo}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{a.tipo}</Badge>
                    <span className="text-xs text-muted-foreground">{a.data}</span>
                  </div>
                </div>
                {a.conteudo && <p className="text-sm text-muted-foreground">{a.conteudo}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
