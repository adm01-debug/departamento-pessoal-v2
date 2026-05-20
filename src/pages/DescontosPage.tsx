import { PageTitle } from '@/components/PageTitle';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { 
  CreditCard, Plus, Landmark, Wallet, 
  TrendingDown, AlertCircle, History, 
  CheckCircle2, XCircle, HandCoins 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DescontosPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('emprestimos');

  // === Queries ===
  const { data: colaboradores = [] } = useQuery({
    queryKey: ['colaboradores-descontos', empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('colaboradores').select('id, nome_completo').eq('empresa_id', empresaAtual?.id as string).eq('status', 'ativo');
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: emprestimos = [], isLoading: loadEmp } = useQuery({
    queryKey: ['emprestimos-consignados', empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emprestimos_consignados' as any)
        .select('*, colaborador:colaboradores(nome_completo)')
        .eq('empresa_id', empresaAtual?.id as string);
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: adiantamentos = [], isLoading: loadAdi } = useQuery({
    queryKey: ['adiantamentos-salariais', empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adiantamentos_salariais' as any)
        .select('*, colaborador:colaboradores(nome_completo)')
        .eq('empresa_id', empresaAtual?.id as string);
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  // === Mutations ===
  const criarEmprestimo = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase.from('emprestimos_consignados' as any).insert({
        ...values,
        empresa_id: empresaAtual?.id,
        status: 'ativo'
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['emprestimos-consignados'] });
      toast.success('Empréstimo registrado com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`),
  });

  const criarAdiantamento = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase.from('adiantamentos_salariais' as any).insert({
        ...values,
        empresa_id: empresaAtual?.id,
        status: 'pendente'
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adiantamentos-salariais'] });
      toast.success('Solicitação de adiantamento enviada!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`),
  });

  const atualizarStatusAdiantamento = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase
        .from('adiantamentos_salariais' as any)
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adiantamentos-salariais'] });
      toast.success('Status atualizado');
    }
  });

  const fmt = (v: number | null) => v ? `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00';

  return (
    <>
      <PageTitle title="Descontos e Retenções" description="Gestão de empréstimos, adiantamentos e vales" />
      <PageLayout 
        title="Descontos Estratégicos" 
        description="Controle de margem consignável e adiantamentos salariais"
        icon={<TrendingDown className="h-5 w-5 text-primary-foreground" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription>Empréstimos Ativos</CardDescription>
              <CardTitle className="text-2xl">{emprestimos.filter((e:any) => e.status === 'ativo').length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Landmark className="h-3 w-3" />
                Total Retido: {fmt(emprestimos.reduce((acc:number, e:any) => acc + (e.status === 'ativo' ? e.valor_parcela : 0), 0))} / mês
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-transparent border-warning/20">
            <CardHeader className="pb-2">
              <CardDescription>Adiantamentos Pendentes</CardDescription>
              <CardTitle className="text-2xl">{adiantamentos.filter((a:any) => a.status === 'pendente').length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="h-3 w-3" />
                Valor a Liberar: {fmt(adiantamentos.filter((a:any) => a.status === 'pendente').reduce((acc:number, a:any) => acc + Number(a.valor_solicitado), 0))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-transparent border-info/20">
            <CardHeader className="pb-2">
              <CardDescription>Alertas de Margem</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                Colaboradores acima de 30% de desconto
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="emprestimos" className="rounded-lg gap-2"><Landmark className="h-4 w-4" /> Empréstimos</TabsTrigger>
            <TabsTrigger value="adiantamentos" className="rounded-lg gap-2"><Wallet className="h-4 w-4" /> Adiantamentos</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {activeTab === 'emprestimos' ? (
              <NewLoanDialog colaboradores={colaboradores} onSave={(v: any) => criarEmprestimo.mutate(v)} />
            ) : (
              <NewAdvanceDialog colaboradores={colaboradores} onSave={(v: any) => criarAdiantamento.mutate(v)} />
            )}
          </div>
          </div>

          <TabsContent value="emprestimos" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                {loadEmp ? <div className="p-12 flex justify-center"><Spinner /></div> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Colaborador</TableHead>
                        <TableHead>Instituição</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Parcela</TableHead>
                        <TableHead>Progresso</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emprestimos.map((e: any) => (
                        <TableRow key={e.id}>
                          <TableCell className="font-medium">{e.colaborador?.nome_completo}</TableCell>
                          <TableCell>{e.instituicao_financeira || '-'}</TableCell>
                          <TableCell>{fmt(e.valor_total)}</TableCell>
                          <TableCell>{fmt(e.valor_parcela)}</TableCell>
                          <TableCell className="w-[200px]">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                                <span>{e.parcelas_pagas} / {e.numero_parcelas}</span>
                                <span>{Math.round((e.parcelas_pagas / e.numero_parcelas) * 100)}%</span>
                              </div>
                              <Progress value={(e.parcelas_pagas / e.numero_parcelas) * 100} className="h-1" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={e.status === 'ativo' ? 'default' : 'secondary'}>
                              {e.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {emprestimos.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                            Nenhum empréstimo registrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adiantamentos" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                {loadAdi ? <div className="p-12 flex justify-center"><Spinner /></div> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Colaborador</TableHead>
                        <TableHead>Data Solicitação</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Competência</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adiantamentos.map((a: any) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.colaborador?.nome_completo}</TableCell>
                          <TableCell>{new Date(a.data_solicitacao).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{fmt(a.valor_solicitado)}</TableCell>
                          <TableCell>{a.competencia_desconto}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              a.status === 'pendente' && "bg-warning text-warning-foreground",
                              a.status === 'aprovado' && "bg-success text-success-foreground",
                              a.status === 'rejeitado' && "bg-destructive text-destructive-foreground",
                              a.status === 'pago' && "bg-primary text-primary-foreground"
                            )}>
                              {a.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {a.status === 'pendente' && (
                              <div className="flex justify-end gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-success" onClick={() => atualizarStatusAdiantamento.mutate({ id: a.id, status: 'aprovado' })}>
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => atualizarStatusAdiantamento.mutate({ id: a.id, status: 'rejeitado' })}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {adiantamentos.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                            Nenhuma solicitação de adiantamento.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
}

function NewLoanDialog({ colaboradores, onSave }: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    colaborador_id: '',
    instituicao_financeira: '',
    valor_total: '',
    numero_parcelas: '',
    data_inicio: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = () => {
    const valor_parcela = Number(form.valor_total) / Number(form.numero_parcelas);
    onSave({
      ...form,
      valor_total: Number(form.valor_total),
      numero_parcelas: Number(form.numero_parcelas),
      valor_parcela
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl"><Plus className="h-4 w-4" /> Novo Empréstimo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Empréstimo Consignado</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Colaborador</Label>
            <Select value={form.colaborador_id} onValueChange={(v) => setForm(p => ({ ...p, colaborador_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione o colaborador" /></SelectTrigger>
              <SelectContent>
                {colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Instituição Financeira</Label>
            <Input value={form.instituicao_financeira} onChange={e => setForm(p => ({ ...p, instituicao_financeira: e.target.value }))} placeholder="Ex: Banco do Brasil" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor Total (R$)</Label>
              <Input type="number" value={form.valor_total} onChange={e => setForm(p => ({ ...p, valor_total: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Número de Parcelas</Label>
              <Input type="number" value={form.numero_parcelas} onChange={e => setForm(p => ({ ...p, numero_parcelas: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data de Início</Label>
            <Input type="date" value={form.data_inicio} onChange={e => setForm(p => ({ ...p, data_inicio: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar Empréstimo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewAdvanceDialog({ colaboradores, onSave }: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    colaborador_id: '',
    valor_solicitado: '',
    competencia_desconto: new Date().toISOString().slice(0, 7),
    motivo: ''
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl"><HandCoins className="h-4 w-4" /> Novo Adiantamento</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitar Adiantamento Salarial</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Colaborador</Label>
            <Select value={form.colaborador_id} onValueChange={(v) => setForm(p => ({ ...p, colaborador_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione o colaborador" /></SelectTrigger>
              <SelectContent>
                {colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor Solicitado (R$)</Label>
              <Input type="number" value={form.valor_solicitado} onChange={e => setForm(p => ({ ...p, valor_solicitado: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Competência para Desconto</Label>
              <Input type="month" value={form.competencia_desconto} onChange={e => setForm(p => ({ ...p, competencia_desconto: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Motivo (Opcional)</Label>
            <Input value={form.motivo} onChange={e => setForm(p => ({ ...p, motivo: e.target.value }))} placeholder="Ex: Emergência médica" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={() => { onSave(form); setOpen(false); }}>Enviar Solicitação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
