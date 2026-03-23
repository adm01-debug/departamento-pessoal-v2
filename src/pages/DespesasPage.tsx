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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { despesaService } from '@/services/despesaService';
import { colaboradorService } from '@/services';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, Receipt, DollarSign, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';

const statusColors: Record<string, string> = { pendente: 'secondary', aprovada: 'default', rejeitada: 'destructive', reembolsada: 'outline' };

export default function DespesasPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ colaborador_id: '', categoria: 'transporte', descricao: '', valor: '', data_despesa: '' });

  const { data: despesas = [], isLoading } = useQuery({ queryKey: ['despesas', empresaAtual?.id], queryFn: () => despesaService.listar(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: colaboradores = [] } = useQuery({ queryKey: ['colaboradores', empresaAtual?.id], queryFn: () => colaboradorService.list(empresaAtual?.id), enabled: !!empresaAtual?.id });

  const criar = useMutation({
    mutationFn: () => despesaService.criar({ ...form, valor: Number(form.valor), empresa_id: empresaAtual?.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['despesas'] }); setOpen(false); toast.success('Despesa registrada!'); setForm({ colaborador_id: '', categoria: 'transporte', descricao: '', valor: '', data_despesa: '' }); },
    onError: () => toast.error('Erro ao registrar despesa'),
  });

  const aprovar = useMutation({ mutationFn: (id: string) => despesaService.aprovar(id, ''), onSuccess: () => { qc.invalidateQueries({ queryKey: ['despesas'] }); toast.success('Despesa aprovada!'); } });
  const rejeitar = useMutation({ mutationFn: (id: string) => despesaService.rejeitar(id, ''), onSuccess: () => { qc.invalidateQueries({ queryKey: ['despesas'] }); toast.success('Despesa rejeitada'); } });
  const excluir = useMutation({ mutationFn: (id: string) => despesaService.excluir(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['despesas'] }); toast.success('Excluída'); } });

  const totalPendente = despesas.filter((d: any) => d.status === 'pendente').reduce((s: number, d: any) => s + Number(d.valor), 0);
  const totalAprovado = despesas.filter((d: any) => d.status === 'aprovada' || d.status === 'reembolsada').reduce((s: number, d: any) => s + Number(d.valor), 0);

  return (
    <>
    <PageTitle title="Despesas" description="Controle de despesas" />
    <PageLayout title="Gestão de Despesas & Diárias">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-4 flex items-center gap-3"><Receipt className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{despesas.length}</p><p className="text-xs text-muted-foreground">Total despesas</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><Clock className="h-8 w-8 text-warning" /><div><p className="text-2xl font-bold">{despesas.filter((d: any) => d.status === 'pendente').length}</p><p className="text-xs text-muted-foreground">Pendentes</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><DollarSign className="h-8 w-8 text-destructive" /><div><p className="text-2xl font-bold">{totalPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p><p className="text-xs text-muted-foreground">Valor pendente</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><CheckCircle className="h-8 w-8 text-success" /><div><p className="text-2xl font-bold">{totalAprovado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p><p className="text-xs text-muted-foreground">Valor aprovado</p></div></CardContent></Card>
      </div>

      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nova Despesa</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar Despesa</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Colaborador</Label>
                <Select value={form.colaborador_id} onValueChange={v => setForm(p => ({ ...p, colaborador_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Categoria</Label>
                <Select value={form.categoria} onValueChange={v => setForm(p => ({ ...p, categoria: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="transporte">Transporte</SelectItem><SelectItem value="alimentacao">Alimentação</SelectItem><SelectItem value="hospedagem">Hospedagem</SelectItem><SelectItem value="material">Material</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Valor (R$)</Label><Input type="number" step="0.01" value={form.valor} onChange={e => setForm(p => ({ ...p, valor: e.target.value }))} /></div>
                <div><Label>Data</Label><Input type="date" value={form.data_despesa} onChange={e => setForm(p => ({ ...p, data_despesa: e.target.value }))} /></div>
              </div>
              <Button className="w-full" onClick={() => criar.mutate()} disabled={!form.colaborador_id || !form.valor || !form.descricao || !form.data_despesa || criar.isPending}>{criar.isPending ? 'Registrando...' : 'Registrar'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <Spinner /> : (
        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Categoria</TableHead><TableHead>Descrição</TableHead><TableHead>Valor</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {despesas.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhuma despesa registrada</TableCell></TableRow> :
                despesas.map((d: any) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{(d as any).colaborador?.nome_completo || '—'}</TableCell>
                    <TableCell><Badge variant="outline">{d.categoria}</Badge></TableCell>
                    <TableCell className="max-w-[200px] truncate">{d.descricao}</TableCell>
                    <TableCell className="font-medium">{Number(d.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    <TableCell className="text-xs">{d.data_despesa}</TableCell>
                    <TableCell><Badge variant={statusColors[d.status] as any}>{d.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {d.status === 'pendente' && <>
                          <Button size="sm" variant="ghost" className="text-success" onClick={() => aprovar.mutate(d.id)}><CheckCircle className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => rejeitar.mutate(d.id)}><XCircle className="h-4 w-4" /></Button>
                        </>}
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => excluir.mutate(d.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Card>
      )}
    </PageLayout>
    </>
  );
}
