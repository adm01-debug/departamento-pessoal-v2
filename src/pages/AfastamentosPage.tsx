import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAfastamentos } from '@/hooks/useAfastamentos';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyList } from '@/components/ui/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { Heart, Plus, Calendar, Clock, AlertTriangle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  ativo: 'bg-warning/15 text-warning border-0',
  aprovado: 'bg-success/15 text-success border-0',
  finalizado: 'bg-success/15 text-success border-0',
  pendente: 'bg-info/15 text-info border-0',
  cancelado: 'bg-destructive/15 text-destructive border-0',
  rejeitado: 'bg-destructive/15 text-destructive border-0',
};

const tipoLabels: Record<string, string> = {
  doenca: 'Doença', acidente_trabalho: 'Acidente Trabalho', maternidade: 'Maternidade',
  paternidade: 'Paternidade', auxilio_doenca: 'Auxílio Doença', outros: 'Outros',
};

export default function AfastamentosPage() {
  const { afastamentos, isLoading } = useAfastamentos();
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [tab, setTab] = useState('todos');
  const [mainTab, setMainTab] = useState('afastamentos');

  const filtered = tab === 'todos' ? afastamentos : afastamentos.filter((a: any) => a.status === tab);

  const stats = {
    total: afastamentos.length,
    ativos: afastamentos.filter((a: any) => a.status === 'ativo').length,
    pendentes: afastamentos.filter((a: any) => a.status === 'pendente').length,
    finalizados: afastamentos.filter((a: any) => a.status === 'finalizado').length,
    diasTotais: afastamentos.reduce((sum: number, a: any) => sum + (a.dias_total || 0), 0),
  };

  // === Prorrogações ===
  const [openProrr, setOpenProrr] = useState(false);
  const [prorrForm, setProrrForm] = useState({ afastamento_id: '', data_fim_anterior: '', data_fim_nova: '', dias_adicionais: '', motivo: '', data_pericia: '', numero_beneficio_novo: '' });

  const { data: prorrogacoes = [], isLoading: loadProrr } = useQuery({
    queryKey: ['prorrogacoes-afastamento'],
    queryFn: async () => {
      const { data, error } = await supabase.from('prorrogacoes_afastamento' as any).select('*, afastamento:afastamentos(colaborador_id, tipo, data_inicio, colaborador:colaboradores(nome_completo))').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const criarProrrogacao = useMutation({
    mutationFn: async (d: typeof prorrForm) => {
      const { error } = await supabase.from('prorrogacoes_afastamento' as any).insert({
        afastamento_id: d.afastamento_id,
        data_fim_anterior: d.data_fim_anterior,
        data_fim_nova: d.data_fim_nova,
        dias_adicionais: Number(d.dias_adicionais),
        motivo: d.motivo || null,
        data_pericia: d.data_pericia || null,
        numero_beneficio_novo: d.numero_beneficio_novo || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['prorrogacoes-afastamento'] }); setOpenProrr(false); setProrrForm({ afastamento_id: '', data_fim_anterior: '', data_fim_nova: '', dias_adicionais: '', motivo: '', data_pericia: '', numero_beneficio_novo: '' }); toast.success('Prorrogação registrada'); },
    onError: () => toast.error('Erro ao registrar prorrogação'),
  });

  const afastamentosAtivos = afastamentos.filter((a: any) => a.status === 'ativo' || a.status === 'aprovado');

  const handleSelectAfastamento = (id: string) => {
    const af = afastamentos.find((a: any) => a.id === id);
    setProrrForm(p => ({ ...p, afastamento_id: id, data_fim_anterior: af?.data_fim_prevista || '' }));
  };

  return (
    <>
    <PageTitle title="Afastamentos" description="Controle de afastamentos de colaboradores" />
    <PageLayout
      title="Afastamentos"
      description="Controle completo de afastamentos, licenças e prorrogações"
      icon={<Heart className="h-5 w-5 text-primary-foreground" />}
      gradient="from-destructive to-warning"
      actions={
        <Button className="rounded-xl bg-gradient-to-r from-destructive to-warning hover:opacity-90 shadow-lg font-body">
          <Plus className="h-4 w-4 mr-2" />Novo Afastamento
        </Button>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: Activity, color: 'text-foreground' },
          { label: 'Ativos', value: stats.ativos, icon: AlertTriangle, color: 'text-warning' },
          { label: 'Pendentes', value: stats.pendentes, icon: Clock, color: 'text-info' },
          { label: 'Finalizados', value: stats.finalizados, icon: Heart, color: 'text-success' },
          { label: 'Dias Totais', value: stats.diasTotais, icon: Calendar, color: 'text-destructive' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl">
              <CardContent className="pt-4 text-center">
                <kpi.icon className={`h-5 w-5 mx-auto mb-1 ${kpi.color}`} />
                <p className={`text-2xl font-display font-bold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-muted-foreground font-body">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="afastamentos">Afastamentos</TabsTrigger>
          <TabsTrigger value="prorrogacoes">Prorrogações</TabsTrigger>
        </TabsList>

        <TabsContent value="afastamentos">
          <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-destructive to-warning" />
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <CardTitle className="font-display">Registros de Afastamento</CardTitle>
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList className="h-8">
                    <TabsTrigger value="todos" className="text-xs px-2 h-6">Todos</TabsTrigger>
                    <TabsTrigger value="ativo" className="text-xs px-2 h-6">Ativos</TabsTrigger>
                    <TabsTrigger value="pendente" className="text-xs px-2 h-6">Pendentes</TabsTrigger>
                    <TabsTrigger value="finalizado" className="text-xs px-2 h-6">Finalizados</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8"><Spinner size="lg" /></div>
              ) : filtered.length === 0 ? (
                <EmptyList entityName="afastamento" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-display font-semibold">Colaborador</TableHead>
                      <TableHead className="font-display font-semibold">Tipo</TableHead>
                      <TableHead className="font-display font-semibold">Início</TableHead>
                      <TableHead className="font-display font-semibold">Fim Previsto</TableHead>
                      <TableHead className="font-display font-semibold">Dias</TableHead>
                      <TableHead className="font-display font-semibold">CID</TableHead>
                      <TableHead className="font-display font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((a: any) => (
                      <TableRow key={a.id} className="hover:bg-accent/30 transition-colors">
                        <TableCell className="font-body font-medium">{a.colaborador?.nome_completo || '—'}</TableCell>
                        <TableCell className="font-body text-sm">
                          <Badge variant="outline" className="text-xs">{tipoLabels[a.tipo] || a.tipo}</Badge>
                        </TableCell>
                        <TableCell className="font-body text-sm">{new Date(a.data_inicio).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="font-body text-sm">{new Date(a.data_fim_prevista).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="font-body text-sm font-medium">{a.dias_total || '—'}</TableCell>
                        <TableCell className="font-body text-sm">{a.cid || '—'}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${statusColors[a.status] || 'bg-muted text-muted-foreground border-0'}`}>
                            {a.status || '—'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prorrogacoes">
          <div className="flex justify-end mb-4">
            <Dialog open={openProrr} onOpenChange={setOpenProrr}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nova Prorrogação</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Registrar Prorrogação de Afastamento</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Afastamento</Label>
                    <Select value={prorrForm.afastamento_id} onValueChange={handleSelectAfastamento}>
                      <SelectTrigger><SelectValue placeholder="Selecione o afastamento" /></SelectTrigger>
                      <SelectContent>{afastamentosAtivos.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.colaborador?.nome_completo || 'N/A'} — {tipoLabels[a.tipo] || a.tipo} ({new Date(a.data_inicio).toLocaleDateString('pt-BR')})</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Fim Anterior</Label><Input type="date" value={prorrForm.data_fim_anterior} onChange={e => setProrrForm(p => ({ ...p, data_fim_anterior: e.target.value }))} /></div>
                    <div><Label>Novo Fim</Label><Input type="date" value={prorrForm.data_fim_nova} onChange={e => setProrrForm(p => ({ ...p, data_fim_nova: e.target.value }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Dias Adicionais</Label><Input type="number" value={prorrForm.dias_adicionais} onChange={e => setProrrForm(p => ({ ...p, dias_adicionais: e.target.value }))} /></div>
                    <div><Label>Data Perícia</Label><Input type="date" value={prorrForm.data_pericia} onChange={e => setProrrForm(p => ({ ...p, data_pericia: e.target.value }))} /></div>
                  </div>
                  <div><Label>Nº Benefício Novo</Label><Input value={prorrForm.numero_beneficio_novo} onChange={e => setProrrForm(p => ({ ...p, numero_beneficio_novo: e.target.value }))} /></div>
                  <div><Label>Motivo</Label><Textarea value={prorrForm.motivo} onChange={e => setProrrForm(p => ({ ...p, motivo: e.target.value }))} /></div>
                  <Button onClick={() => criarProrrogacao.mutate(prorrForm)} disabled={!prorrForm.afastamento_id || !prorrForm.dias_adicionais || criarProrrogacao.isPending} className="w-full">{criarProrrogacao.isPending ? 'Salvando...' : 'Registrar Prorrogação'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card><CardContent className="p-0">
            {loadProrr ? <div className="p-8 flex justify-center"><Spinner /></div> : (
              <Table>
                <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo Afastamento</TableHead><TableHead>Fim Anterior</TableHead><TableHead>Novo Fim</TableHead><TableHead>Dias Adicionais</TableHead><TableHead>Motivo</TableHead></TableRow></TableHeader>
                <TableBody>
                  {prorrogacoes.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{(p as any).afastamento?.colaborador?.nome_completo || '-'}</TableCell>
                      <TableCell>{tipoLabels[(p as any).afastamento?.tipo] || (p as any).afastamento?.tipo || '-'}</TableCell>
                      <TableCell>{p.data_fim_anterior ? new Date(p.data_fim_anterior).toLocaleDateString('pt-BR') : '-'}</TableCell>
                      <TableCell>{p.data_fim_nova ? new Date(p.data_fim_nova).toLocaleDateString('pt-BR') : '-'}</TableCell>
                      <TableCell className="font-medium">{p.dias_adicionais}</TableCell>
                      <TableCell className="max-w-xs truncate">{p.motivo || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {prorrogacoes.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhuma prorrogação registrada</TableCell></TableRow>}
                </TableBody>
              </Table>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
    </>
  );
}