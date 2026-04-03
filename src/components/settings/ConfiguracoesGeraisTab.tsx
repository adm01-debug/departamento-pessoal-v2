import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Save, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function ConfiguracoesGeraisTab() {
  const qc = useQueryClient();
  const [openNew, setOpenNew] = useState(false);
  const [form, setForm] = useState({ chave: '', valor: '', descricao: '' });

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['configuracoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuracoes' as any)
        .select('*')
        .order('chave');
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data || [];
    },
  });

  const criar = useMutation({
    mutationFn: async (d: typeof form) => {
      const { error } = await supabase.from('configuracoes' as any).insert({
        chave: d.chave,
        valor: d.valor,
        descricao: d.descricao || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracoes'] });
      setOpenNew(false);
      setForm({ chave: '', valor: '', descricao: '' });
      toast.success('Configuração criada');
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao criar'),
  });

  const excluir = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('configuracoes' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracoes'] });
      toast.success('Configuração removida');
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-display flex items-center gap-2">
                <Database className="h-5 w-5" /> Configurações do Sistema
              </CardTitle>
              <CardDescription className="font-body">
                Parâmetros gerais armazenados no banco de dados
              </CardDescription>
            </div>
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-1 h-4 w-4" />Nova Config</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nova Configuração</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Chave</Label>
                    <Input value={form.chave} onChange={e => setForm(p => ({ ...p, chave: e.target.value }))} placeholder="Ex: app.timezone" />
                  </div>
                  <div>
                    <Label>Valor</Label>
                    <Input value={form.valor} onChange={e => setForm(p => ({ ...p, valor: e.target.value }))} placeholder="Ex: America/Sao_Paulo" />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Input value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} placeholder="Descrição opcional" />
                  </div>
                  <Button onClick={() => criar.mutate(form)} disabled={!form.chave || !form.valor || criar.isPending} className="w-full">
                    <Save className="mr-1 h-4 w-4" />{criar.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center"><Spinner /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chave</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm font-medium">{c.chave}</TableCell>
                    <TableCell><Badge variant="secondary" className="font-mono">{c.valor}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.descricao || '-'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.updated_at ? new Date(c.updated_at).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => excluir.mutate(c.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {configs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhuma configuração cadastrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
