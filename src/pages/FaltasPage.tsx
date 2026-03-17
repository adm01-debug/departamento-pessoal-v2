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
import { faltasService } from '@/services';
import { colaboradorService } from '@/services';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, UserX, Trash2 } from 'lucide-react';

const tipoLabels: Record<string, string> = { justificada: 'Justificada', injustificada: 'Injustificada', abonada: 'Abonada', parcial: 'Parcial' };

export default function FaltasPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ colaborador_id: '', data: '', tipo: 'injustificada', motivo: '', horas_falta: '' });

  const { data: faltas = [], isLoading } = useQuery({ queryKey: ['faltas', empresaAtual?.id], queryFn: () => faltasService.listar(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: colaboradores = [] } = useQuery({ queryKey: ['colaboradores', empresaAtual?.id], queryFn: () => colaboradorService.list(empresaAtual?.id), enabled: !!empresaAtual?.id });

  const criar = useMutation({
    mutationFn: (d: any) => faltasService.criar({ ...d, empresa_id: empresaAtual?.id, horas_falta: d.horas_falta ? Number(d.horas_falta) : null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faltas'] }); setOpen(false); toast.success('Falta registrada!'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluir = useMutation({
    mutationFn: (id: string) => faltasService.excluir(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faltas'] }); toast.success('Falta excluída!'); },
  });

  if (isLoading) return <PageLayout title="Faltas"><Spinner /></PageLayout>;

  const stats = {
    total: faltas.length,
    justificadas: faltas.filter((f: any) => f.tipo === 'justificada').length,
    injustificadas: faltas.filter((f: any) => f.tipo === 'injustificada').length,
    abonadas: faltas.filter((f: any) => f.tipo === 'abonada').length,
  };

  return (
    <PageLayout title="Gestão de Faltas" description="Controle de ausências dos colaboradores">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-green-600">{stats.justificadas}</p><p className="text-sm text-muted-foreground">Justificadas</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-destructive">{stats.injustificadas}</p><p className="text-sm text-muted-foreground">Injustificadas</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-blue-600">{stats.abonadas}</p><p className="text-sm text-muted-foreground">Abonadas</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Faltas Registradas</h3>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Registrar Falta</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Registrar Falta</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Colaborador *</Label>
                    <Select value={form.colaborador_id} onValueChange={v => setForm(p => ({ ...p, colaborador_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Data *</Label><Input type="date" value={form.data} onChange={e => setForm(p => ({ ...p, data: e.target.value }))} /></div>
                  <div><Label>Tipo</Label>
                    <Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(tipoLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Horas (parcial)</Label><Input type="number" value={form.horas_falta} onChange={e => setForm(p => ({ ...p, horas_falta: e.target.value }))} placeholder="Ex: 4" /></div>
                  <div><Label>Motivo</Label><Textarea value={form.motivo} onChange={e => setForm(p => ({ ...p, motivo: e.target.value }))} /></div>
                  <Button className="w-full" onClick={() => criar.mutate(form)} disabled={!form.colaborador_id || !form.data}>Salvar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Data</TableHead><TableHead>Tipo</TableHead><TableHead>Motivo</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {faltas.map((f: any) => (
                <TableRow key={f.id}>
                  <TableCell>{f.colaborador?.nome_completo || '—'}</TableCell>
                  <TableCell>{f.data}</TableCell>
                  <TableCell><Badge variant={f.tipo === 'injustificada' ? 'destructive' : 'secondary'}>{tipoLabels[f.tipo] || f.tipo}</Badge></TableCell>
                  <TableCell className="max-w-[200px] truncate">{f.motivo || '—'}</TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => excluir.mutate(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
              {faltas.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Nenhuma falta registrada</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
