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
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, Handshake, Trash2 } from 'lucide-react';

export default function ConveniosPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', tipo: '', limite_global: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['convenios', empresaAtual?.id],
    queryFn: async () => {
      let q = supabase.from('convenios').select('*').order('nome');
      if (empresaAtual?.id) q = q.eq('empresa_id', empresaAtual.id);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const criar = useMutation({
    mutationFn: async (d: typeof form) => {
      const { error } = await supabase.from('convenios').insert({ nome: d.nome, tipo: d.tipo || null, limite_global: d.limite_global ? Number(d.limite_global) : null, empresa_id: empresaAtual?.id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['convenios'] }); setOpen(false); toast.success('Convênio criado'); },
  });

  const excluir = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('convenios').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['convenios'] }); toast.success('Excluído'); },
  });

  return (
    <PageLayout title="Convênios" description="Gestão de convênios empresariais" icon={<Handshake className="h-5 w-5 text-primary-foreground" />}>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo Convênio</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Convênio</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nome</Label><Input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} /></div>
              <div><Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmacia">Farmácia</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="lazer">Lazer</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Limite Global (R$)</Label><Input type="number" value={form.limite_global} onChange={e => setForm(p => ({ ...p, limite_global: e.target.value }))} /></div>
              <Button onClick={() => criar.mutate(form)} disabled={!form.nome} className="w-full">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        {isLoading ? <div className="p-8 flex justify-center"><Spinner /></div> : (
          <Table>
            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Limite Global</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {data?.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nome}</TableCell>
                  <TableCell className="capitalize">{r.tipo || '-'}</TableCell>
                  <TableCell>{r.limite_global ? `R$ ${Number(r.limite_global).toLocaleString('pt-BR')}` : '-'}</TableCell>
                  <TableCell><Badge variant={r.ativo ? 'default' : 'secondary'}>{r.ativo ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => excluir.mutate(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
              {!data?.length && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum convênio cadastrado</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>
    </PageLayout>
  );
}
