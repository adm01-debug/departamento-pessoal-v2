import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react';

export default function SegurosVidaPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [tab, setTab] = useState('seguros');

  // === Seguros ===
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ seguradora: '', numero_apolice: '', capital_segurado: '', premio_mensal: '', data_inicio: '', data_fim: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['seguros-vida', empresaAtual?.id],
    queryFn: async () => {
      let q = supabase.from('seguros_vida').select('*').order('created_at', { ascending: false });
      if (empresaAtual?.id) q = q.eq('empresa_id', empresaAtual.id);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const criar = useMutation({
    mutationFn: async (d: typeof form) => {
      const { error } = await supabase.from('seguros_vida').insert({
        seguradora: d.seguradora, numero_apolice: d.numero_apolice || null,
        capital_segurado: d.capital_segurado ? Number(d.capital_segurado) : null,
        premio_mensal: d.premio_mensal ? Number(d.premio_mensal) : null,
        data_inicio: d.data_inicio || null, data_fim: d.data_fim || null,
        empresa_id: empresaAtual?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['seguros-vida'] }); setOpen(false); toast.success('Seguro cadastrado'); },
  });

  const excluir = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('seguros_vida').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['seguros-vida'] }); toast.success('Excluído'); },
  });

  // === Sinistros ===
  const [openSin, setOpenSin] = useState(false);
  const [sinForm, setSinForm] = useState({ seguro_vida_id: '', colaborador_id: '', tipo: '', data_sinistro: '', descricao: '' });

  const { data: colaboradores = [] } = useQuery({
    queryKey: ['colaboradores-seguro', empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('colaboradores').select('id, nome_completo').eq('status', 'ativo');
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: sinistros = [], isLoading: loadSin } = useQuery({
    queryKey: ['sinistros-seguro', empresaAtual?.id],
    queryFn: async () => {
      const { data: error_data, error } = await supabase.from('sinistros_seguro' as any).select('*, colaborador:colaboradores(nome_completo), seguro:seguros_vida(seguradora)').order('created_at', { ascending: false });
      if (error) throw error;
      return error_data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const criarSinistro = useMutation({
    mutationFn: async (d: typeof sinForm) => {
      const { error } = await supabase.from('sinistros_seguro' as any).insert({
        seguro_vida_id: d.seguro_vida_id || null,
        colaborador_id: d.colaborador_id || null,
        tipo: d.tipo || null,
        data_sinistro: d.data_sinistro || null,
        descricao: d.descricao || null,
        status: 'aberto',
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sinistros-seguro'] }); setOpenSin(false); setSinForm({ seguro_vida_id: '', colaborador_id: '', tipo: '', data_sinistro: '', descricao: '' }); toast.success('Sinistro registrado'); },
    onError: () => toast.error('Erro ao registrar sinistro'),
  });

  const fmt = (v: number | null) => v ? `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';

  return (
    <PageLayout title="Seguros de Vida" description="Apólices, coberturas e sinistros" icon={<ShieldCheck className="h-5 w-5 text-primary-foreground" />}>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="seguros">Apólices</TabsTrigger>
          <TabsTrigger value="sinistros">Sinistros</TabsTrigger>
        </TabsList>

        <TabsContent value="seguros">
          <div className="flex justify-end mb-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo Seguro</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo Seguro de Vida</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Seguradora</Label><Input value={form.seguradora} onChange={e => setForm(p => ({ ...p, seguradora: e.target.value }))} /></div>
                  <div><Label>Nº Apólice</Label><Input value={form.numero_apolice} onChange={e => setForm(p => ({ ...p, numero_apolice: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Capital Segurado</Label><Input type="number" value={form.capital_segurado} onChange={e => setForm(p => ({ ...p, capital_segurado: e.target.value }))} /></div>
                    <div><Label>Prêmio Mensal</Label><Input type="number" value={form.premio_mensal} onChange={e => setForm(p => ({ ...p, premio_mensal: e.target.value }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Início</Label><Input type="date" value={form.data_inicio} onChange={e => setForm(p => ({ ...p, data_inicio: e.target.value }))} /></div>
                    <div><Label>Fim</Label><Input type="date" value={form.data_fim} onChange={e => setForm(p => ({ ...p, data_fim: e.target.value }))} /></div>
                  </div>
                  <Button onClick={() => criar.mutate(form)} disabled={!form.seguradora} className="w-full">Salvar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card><CardContent className="p-0">
            {isLoading ? <div className="p-8 flex justify-center"><Spinner /></div> : (
              <Table>
                <TableHeader><TableRow><TableHead>Seguradora</TableHead><TableHead>Apólice</TableHead><TableHead>Capital</TableHead><TableHead>Prêmio</TableHead><TableHead>Vigência</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {data?.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.seguradora}</TableCell>
                      <TableCell>{r.numero_apolice || '-'}</TableCell>
                      <TableCell>{fmt(r.capital_segurado)}</TableCell>
                      <TableCell>{fmt(r.premio_mensal)}</TableCell>
                      <TableCell>{r.data_inicio && r.data_fim ? `${new Date(r.data_inicio).toLocaleDateString('pt-BR')} - ${new Date(r.data_fim).toLocaleDateString('pt-BR')}` : '-'}</TableCell>
                      <TableCell><Badge variant={r.ativo ? 'default' : 'secondary'}>{r.ativo ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="icon" onClick={() => excluir.mutate(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                  {!data?.length && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum seguro cadastrado</TableCell></TableRow>}
                </TableBody>
              </Table>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="sinistros">
          <div className="flex justify-end mb-4">
            <Dialog open={openSin} onOpenChange={setOpenSin}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Registrar Sinistro</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Registrar Sinistro</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Seguro</Label>
                    <Select value={sinForm.seguro_vida_id} onValueChange={v => setSinForm(p => ({ ...p, seguro_vida_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione a apólice" /></SelectTrigger>
                      <SelectContent>{data?.map(s => <SelectItem key={s.id} value={s.id}>{s.seguradora} - {s.numero_apolice || 'S/N'}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Colaborador</Label>
                    <Select value={sinForm.colaborador_id} onValueChange={v => setSinForm(p => ({ ...p, colaborador_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Tipo</Label>
                      <Select value={sinForm.tipo} onValueChange={v => setSinForm(p => ({ ...p, tipo: v }))}>
                        <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morte">Morte</SelectItem>
                          <SelectItem value="invalidez">Invalidez</SelectItem>
                          <SelectItem value="doenca_grave">Doença Grave</SelectItem>
                          <SelectItem value="acidente">Acidente</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Data do Sinistro</Label><Input type="date" value={sinForm.data_sinistro} onChange={e => setSinForm(p => ({ ...p, data_sinistro: e.target.value }))} /></div>
                  </div>
                  <div><Label>Descrição</Label><Textarea value={sinForm.descricao} onChange={e => setSinForm(p => ({ ...p, descricao: e.target.value }))} /></div>
                  <Button onClick={() => criarSinistro.mutate(sinForm)} disabled={criarSinistro.isPending} className="w-full">{criarSinistro.isPending ? 'Salvando...' : 'Registrar'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card><CardContent className="p-0">
            {loadSin ? <div className="p-8 flex justify-center"><Spinner /></div> : (
              <Table>
                <TableHeader><TableRow><TableHead>Seguro</TableHead><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {sinistros.map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell>{(s as any).seguro?.seguradora || '-'}</TableCell>
                      <TableCell className="font-medium">{(s as any).colaborador?.nome_completo || '-'}</TableCell>
                      <TableCell className="capitalize">{s.tipo || '-'}</TableCell>
                      <TableCell>{s.data_sinistro ? new Date(s.data_sinistro).toLocaleDateString('pt-BR') : '-'}</TableCell>
                      <TableCell><Badge variant={s.status === 'aberto' ? 'destructive' : s.status === 'em_analise' ? 'secondary' : 'default'}>{s.status || 'aberto'}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {sinistros.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum sinistro registrado</TableCell></TableRow>}
                </TableBody>
              </Table>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}