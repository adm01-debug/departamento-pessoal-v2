import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { workflowService } from '@/services/workflowService';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, GitBranch, Play, CheckCircle, XCircle, Clock, Trash2, Workflow } from 'lucide-react';

const statusColors: Record<string, string> = { pendente: 'secondary', em_andamento: 'default', aprovado: 'default', rejeitado: 'destructive', cancelado: 'outline' };

export default function WorkflowsPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', descricao: '', tipo: 'ferias' });

  const { data: definicoes = [], isLoading: loadDef } = useQuery({
    queryKey: ['workflows_def', empresaAtual?.id],
    queryFn: () => workflowService.listarDefinicoes(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const { data: execucoes = [], isLoading: loadExec } = useQuery({
    queryKey: ['workflows_exec', empresaAtual?.id],
    queryFn: () => workflowService.listarExecucoes(empresaAtual?.id),
  });

  const criar = useMutation({
    mutationFn: () => workflowService.criarDefinicao({ ...form, empresa_id: empresaAtual?.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workflows_def'] }); setOpen(false); toast.success('Workflow criado!'); setForm({ nome: '', descricao: '', tipo: 'ferias' }); },
    onError: () => toast.error('Erro ao criar workflow'),
  });

  const excluir = useMutation({
    mutationFn: (id: string) => workflowService.excluirDefinicao(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workflows_def'] }); toast.success('Workflow excluído'); },
  });

  return (
    <PageLayout title="Workflows Configuráveis">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-4 flex items-center gap-3"><GitBranch className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{definicoes.length}</p><p className="text-xs text-muted-foreground">Workflows</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><Play className="h-8 w-8 text-info" /><div><p className="text-2xl font-bold">{execucoes.filter((e: any) => e.status === 'em_andamento').length}</p><p className="text-xs text-muted-foreground">Em andamento</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><CheckCircle className="h-8 w-8 text-success" /><div><p className="text-2xl font-bold">{execucoes.filter((e: any) => e.status === 'aprovado').length}</p><p className="text-xs text-muted-foreground">Aprovados</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><Clock className="h-8 w-8 text-warning" /><div><p className="text-2xl font-bold">{execucoes.filter((e: any) => e.status === 'pendente').length}</p><p className="text-xs text-muted-foreground">Pendentes</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="definicoes">
        <div className="flex justify-between items-center mb-4">
          <TabsList><TabsTrigger value="definicoes">Definições</TabsTrigger><TabsTrigger value="execucoes">Execuções</TabsTrigger></TabsList>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo Workflow</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo Workflow</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Nome</Label><Input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Aprovação de Férias" /></div>
                <div><Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ferias">Férias</SelectItem>
                      <SelectItem value="afastamento">Afastamento</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                      <SelectItem value="documento">Documento</SelectItem>
                      <SelectItem value="admissao">Admissão</SelectItem>
                      <SelectItem value="desligamento">Desligamento</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} /></div>
                <Button className="w-full" onClick={() => criar.mutate()} disabled={!form.nome || criar.isPending}>{criar.isPending ? 'Criando...' : 'Criar Workflow'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="definicoes">
          {loadDef ? <Spinner /> : definicoes.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground"><Workflow className="mx-auto h-12 w-12 mb-4 opacity-50" /><p>Nenhum workflow configurado</p></CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {definicoes.map((w: any) => (
                <Card key={w.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{w.nome}</CardTitle>
                      <Badge variant={w.ativo ? 'default' : 'secondary'}>{w.ativo ? 'Ativo' : 'Inativo'}</Badge>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">{w.tipo}</Badge>
                  </CardHeader>
                  <CardContent>
                    {w.descricao && <p className="text-sm text-muted-foreground mb-3">{w.descricao}</p>}
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => excluir.mutate(w.id)}><Trash2 className="h-4 w-4 mr-1" />Excluir</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="execucoes">
          {loadExec ? <Spinner /> : (
            <Card>
              <Table>
                <TableHeader><TableRow><TableHead>Workflow</TableHead><TableHead>Tipo</TableHead><TableHead>Entidade</TableHead><TableHead>Status</TableHead><TableHead>Data</TableHead></TableRow></TableHeader>
                <TableBody>
                  {execucoes.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma execução</TableCell></TableRow> :
                    execucoes.map((e: any) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{(e as any).workflow?.nome || '—'}</TableCell>
                        <TableCell><Badge variant="outline">{e.entidade_tipo}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{e.entidade_id?.slice(0, 8)}...</TableCell>
                        <TableCell><Badge variant={statusColors[e.status] as any}>{e.status}</Badge></TableCell>
                        <TableCell className="text-xs">{new Date(e.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
