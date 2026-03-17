import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, Users, Trash2 } from 'lucide-react';

export default function TimesPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', descricao: '' });

  const { data: times = [], isLoading } = useQuery({
    queryKey: ['times', empresaAtual?.id],
    queryFn: async () => {
      let q = supabase.from('times').select('*').order('nome');
      if (empresaAtual?.id) q = q.eq('empresa_id', empresaAtual.id);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const criar = useMutation({
    mutationFn: async (d: any) => {
      const { data, error } = await supabase.from('times').insert({ ...d, empresa_id: empresaAtual?.id }).select().maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['times'] }); setOpen(false); toast.success('Time criado!'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluir = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('times').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['times'] }); toast.success('Time excluído!'); },
  });

  if (isLoading) return <PageLayout title="Times"><Spinner /></PageLayout>;

  return (
    <PageLayout title="Times e Equipes" description="Gerencie os times da empresa">
      <Card><CardContent className="pt-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Times ({times.length})</h3>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo Time</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo Time</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Nome *</Label><Input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} /></div>
                <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} /></div>
                <Button className="w-full" onClick={() => criar.mutate(form)} disabled={!form.nome}>Salvar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Descrição</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {times.map((t: any) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.nome}</TableCell>
                <TableCell>{t.descricao || '—'}</TableCell>
                <TableCell><Button size="icon" variant="ghost" onClick={() => excluir.mutate(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
              </TableRow>
            ))}
            {times.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Nenhum time cadastrado</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </PageLayout>
  );
}
