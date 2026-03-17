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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, ShieldCheck, Trash2 } from 'lucide-react';

export default function SegurosVidaPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
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

  const fmt = (v: number | null) => v ? `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';

  return (
    <PageLayout title="Seguros de Vida" description="Apólices e coberturas de seguros" icon={<ShieldCheck className="h-5 w-5 text-primary-foreground" />}>
      <div className="flex justify-end">
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
    </PageLayout>
  );
}
