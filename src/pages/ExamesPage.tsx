import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { colaboradorService } from '@/services';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, Stethoscope, Trash2 } from 'lucide-react';

export default function ExamesPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ colaborador_id: '', tipo: '', data_exame: '', data_validade: '', medico: '', crm: '', resultado: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['exames'],
    queryFn: async () => {
      const { data, error } = await supabase.from('exames').select('*, colaborador:colaboradores(nome_completo)').order('data_exame', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: colaboradores } = useQuery({
    queryKey: ['colaboradores', empresaAtual?.id],
    queryFn: () => colaboradorService.list(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const criar = useMutation({
    mutationFn: async (d: typeof form) => {
      const { error } = await supabase.from('exames').insert({
        colaborador_id: d.colaborador_id, tipo: d.tipo, data_exame: d.data_exame || null,
        data_validade: d.data_validade || null, medico: d.medico || null, crm: d.crm || null,
        resultado: d.resultado || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['exames'] }); setOpen(false); toast.success('Exame registrado'); },
  });

  const excluir = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('exames').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['exames'] }); toast.success('Excluído'); },
  });

  return (
    <PageLayout title="Exames Ocupacionais" description="Controle de exames médicos obrigatórios" icon={<Stethoscope className="h-5 w-5 text-primary-foreground" />}>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo Exame</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar Exame</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Colaborador</Label>
                <Select value={form.colaborador_id} onValueChange={v => setForm(p => ({ ...p, colaborador_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{colaboradores?.map(c => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admissional">Admissional</SelectItem>
                    <SelectItem value="periodico">Periódico</SelectItem>
                    <SelectItem value="retorno_trabalho">Retorno ao Trabalho</SelectItem>
                    <SelectItem value="mudanca_funcao">Mudança de Função</SelectItem>
                    <SelectItem value="demissional">Demissional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Data Exame</Label><Input type="date" value={form.data_exame} onChange={e => setForm(p => ({ ...p, data_exame: e.target.value }))} /></div>
                <div><Label>Validade</Label><Input type="date" value={form.data_validade} onChange={e => setForm(p => ({ ...p, data_validade: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Médico</Label><Input value={form.medico} onChange={e => setForm(p => ({ ...p, medico: e.target.value }))} /></div>
                <div><Label>CRM</Label><Input value={form.crm} onChange={e => setForm(p => ({ ...p, crm: e.target.value }))} /></div>
              </div>
              <div><Label>Resultado</Label>
                <Select value={form.resultado} onValueChange={v => setForm(p => ({ ...p, resultado: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent><SelectItem value="apto">Apto</SelectItem><SelectItem value="inapto">Inapto</SelectItem><SelectItem value="apto_restricao">Apto com Restrição</SelectItem></SelectContent>
                </Select>
              </div>
              <Button onClick={() => criar.mutate(form)} disabled={!form.colaborador_id || !form.tipo} className="w-full">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        {isLoading ? <div className="p-8 flex justify-center"><Spinner /></div> : (
          <Table>
            <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Data</TableHead><TableHead>Validade</TableHead><TableHead>Resultado</TableHead><TableHead>Médico</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {data?.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.colaborador?.nome_completo || '-'}</TableCell>
                  <TableCell className="capitalize">{r.tipo?.replace('_', ' ')}</TableCell>
                  <TableCell>{r.data_exame ? new Date(r.data_exame).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell>{r.data_validade ? new Date(r.data_validade).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell><Badge variant={r.resultado === 'apto' ? 'default' : r.resultado === 'inapto' ? 'destructive' : 'secondary'}>{r.resultado || 'Pendente'}</Badge></TableCell>
                  <TableCell>{r.medico || '-'}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => excluir.mutate(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
              {!data?.length && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum exame registrado</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>
    </PageLayout>
  );
}
