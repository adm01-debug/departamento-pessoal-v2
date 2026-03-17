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
import { medidasDisciplinaresService } from '@/services';
import { colaboradorService } from '@/services';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, AlertTriangle, Trash2 } from 'lucide-react';

const tipoLabels: Record<string, string> = { advertencia_verbal: 'Advertência Verbal', advertencia_escrita: 'Advertência Escrita', suspensao: 'Suspensão', justa_causa: 'Justa Causa' };
const gravidade: Record<string, 'secondary' | 'default' | 'destructive'> = { advertencia_verbal: 'secondary', advertencia_escrita: 'default', suspensao: 'destructive', justa_causa: 'destructive' };

export default function MedidasDisciplinaresPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ colaborador_id: '', tipo: 'advertencia_verbal', data_ocorrencia: '', descricao: '', dias_suspensao: '' });

  const { data: medidas = [], isLoading } = useQuery({ queryKey: ['medidas-disciplinares', empresaAtual?.id], queryFn: () => medidasDisciplinaresService.listar(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: colaboradores = [] } = useQuery({ queryKey: ['colaboradores', empresaAtual?.id], queryFn: () => colaboradorService.list(empresaAtual?.id), enabled: !!empresaAtual?.id });

  const criar = useMutation({
    mutationFn: (d: any) => medidasDisciplinaresService.criar({ ...d, empresa_id: empresaAtual?.id, dias_suspensao: d.dias_suspensao ? Number(d.dias_suspensao) : null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['medidas-disciplinares'] }); setOpen(false); toast.success('Medida registrada!'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluir = useMutation({
    mutationFn: (id: string) => medidasDisciplinaresService.excluir(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['medidas-disciplinares'] }); toast.success('Registro excluído!'); },
  });

  if (isLoading) return <PageLayout title="Medidas Disciplinares"><Spinner /></PageLayout>;

  return (
    <PageLayout title="Medidas Disciplinares" description="Advertências, suspensões e ações disciplinares">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(tipoLabels).map(([k, label]) => (
          <Card key={k}><CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">{medidas.filter((m: any) => m.tipo === k).length}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Registros</h3>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Nova Medida</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Registrar Medida Disciplinar</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Colaborador *</Label>
                    <Select value={form.colaborador_id} onValueChange={v => setForm(p => ({ ...p, colaborador_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Tipo *</Label>
                    <Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(tipoLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Data Ocorrência *</Label><Input type="date" value={form.data_ocorrencia} onChange={e => setForm(p => ({ ...p, data_ocorrencia: e.target.value }))} /></div>
                  {form.tipo === 'suspensao' && <div><Label>Dias de Suspensão</Label><Input type="number" value={form.dias_suspensao} onChange={e => setForm(p => ({ ...p, dias_suspensao: e.target.value }))} /></div>}
                  <div><Label>Descrição *</Label><Textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} /></div>
                  <Button className="w-full" onClick={() => criar.mutate(form)} disabled={!form.colaborador_id || !form.data_ocorrencia || !form.descricao}>Salvar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Data</TableHead><TableHead>Descrição</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {medidas.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell>{m.colaborador?.nome_completo || '—'}</TableCell>
                  <TableCell><Badge variant={gravidade[m.tipo] || 'secondary'}>{tipoLabels[m.tipo] || m.tipo}</Badge></TableCell>
                  <TableCell>{m.data_ocorrencia}</TableCell>
                  <TableCell className="max-w-[250px] truncate">{m.descricao}</TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => excluir.mutate(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
              {medidas.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Nenhuma medida registrada</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
