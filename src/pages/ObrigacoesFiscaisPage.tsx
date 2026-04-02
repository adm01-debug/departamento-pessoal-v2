import { PageTitle } from '@/components/PageTitle';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FileText, Receipt, DollarSign, Building2, Plus, Download, CheckCircle,
  Clock, AlertTriangle, Calculator, RefreshCw, Calendar, TrendingUp, Shield
} from 'lucide-react';

const statusColors: Record<string, string> = {
  pendente: 'bg-warning/15 text-warning border-0',
  gerada: 'bg-info/15 text-info border-0',
  paga: 'bg-success/15 text-success border-0',
  vencida: 'bg-destructive/15 text-destructive border-0',
  enviada: 'bg-success/15 text-success border-0',
  processada: 'bg-success/15 text-success border-0',
};

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function gerarCompetencias(): string[] {
  const items: string[] = [];
  const hoje = new Date();
  for (let i = -6; i <= 1; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    items.push(`${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`);
  }
  return items.reverse();
}

export default function ObrigacoesFiscaisPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const competencias = useMemo(() => gerarCompetencias(), []);
  const [competencia, setCompetencia] = useState(competencias[0]);
  const [openGuia, setOpenGuia] = useState(false);
  const [guiaForm, setGuiaForm] = useState({ tipo: 'fgts', valor: '', vencimento: '' });

  const { data: dctf = [], isLoading: l1 } = useQuery({
    queryKey: ['dctfweb', empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('dctfweb_declaracoes').select('*')
        .eq('empresa_id', empresaAtual!.id).order('competencia', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: sefip = [], isLoading: l2 } = useQuery({
    queryKey: ['sefip', empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('sefip_arquivos').select('*')
        .eq('empresa_id', empresaAtual!.id).order('competencia', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: guiasFgts = [], isLoading: l3 } = useQuery({
    queryKey: ['guias-fgts', empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('guias_fgts').select('*')
        .eq('empresa_id', empresaAtual!.id).order('competencia', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: guiasInss = [], isLoading: l4 } = useQuery({
    queryKey: ['guias-inss', empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('guias_inss').select('*')
        .eq('empresa_id', empresaAtual!.id).order('competencia', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  // Generate guide mutation
  const gerarGuia = useMutation({
    mutationFn: async () => {
      const [mes, ano] = competencia.split('/');
      const comp = `${ano}-${mes}`;
      const table = guiaForm.tipo === 'fgts' ? 'guias_fgts' : 'guias_inss';
      const { error } = await supabase.from(table).insert({
        empresa_id: empresaAtual?.id,
        competencia: comp,
        valor: parseFloat(guiaForm.valor) || 0,
        data_vencimento: guiaForm.vencimento || null,
        status: 'gerada',
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['guias-fgts'] });
      qc.invalidateQueries({ queryKey: ['guias-inss'] });
      setOpenGuia(false);
      setGuiaForm({ tipo: 'fgts', valor: '', vencimento: '' });
      toast.success('Guia gerada com sucesso!');
    },
    onError: () => toast.error('Erro ao gerar guia'),
  });

  // Mark as paid
  const marcarPaga = useMutation({
    mutationFn: async ({ id, tabela }: { id: string; tabela: string }) => {
      const { error } = await supabase.from(tabela as any)
        .update({ status: 'paga', data_pagamento: new Date().toISOString() } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['guias-fgts'] });
      qc.invalidateQueries({ queryKey: ['guias-inss'] });
      toast.success('Guia marcada como paga!');
    },
  });

  const isLoading = l1 || l2 || l3 || l4;
  const hoje = new Date();

  // Stats
  const totalFgts = guiasFgts.reduce((acc: number, g: any) => acc + (g.valor || 0), 0);
  const totalInss = guiasInss.reduce((acc: number, g: any) => acc + (g.valor || 0), 0);
  const guiasVencidas = [...guiasFgts, ...guiasInss].filter((g: any) =>
    g.status !== 'paga' && g.data_vencimento && new Date(g.data_vencimento) < hoje
  ).length;
  const guiasPendentes = [...guiasFgts, ...guiasInss].filter((g: any) => g.status === 'gerada').length;

  return (
    <>
      <PageTitle title="Obrigações Fiscais" description="Gestão de obrigações fiscais trabalhistas" />
      <PageLayout
        title="Obrigações Fiscais"
        description="DCTFWeb, SEFIP, Guias FGTS, INSS e DARF"
        icon={<Receipt className="h-5 w-5 text-primary-foreground" />}
        gradient="from-warning to-primary"
        actions={
          <div className="flex items-center gap-2">
            <Select value={competencia} onValueChange={setCompetencia}>
              <SelectTrigger className="w-[130px] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{competencias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Dialog open={openGuia} onOpenChange={setOpenGuia}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-gradient-to-r from-primary to-primary-glow font-body">
                  <Plus className="mr-2 h-4 w-4" />Gerar Guia
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader><DialogTitle className="font-display">Gerar Guia de Recolhimento</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label className="font-body">Tipo</Label>
                    <Select value={guiaForm.tipo} onValueChange={v => setGuiaForm(p => ({ ...p, tipo: v }))}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fgts">FGTS (GRF)</SelectItem>
                        <SelectItem value="inss">GPS / INSS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="font-body">Competência</Label>
                    <Input value={competencia} disabled className="rounded-xl" />
                  </div>
                  <div><Label className="font-body">Valor (R$)</Label>
                    <Input type="number" step="0.01" value={guiaForm.valor} onChange={e => setGuiaForm(p => ({ ...p, valor: e.target.value }))} placeholder="0,00" className="rounded-xl" />
                  </div>
                  <div><Label className="font-body">Data de Vencimento</Label>
                    <Input type="date" value={guiaForm.vencimento} onChange={e => setGuiaForm(p => ({ ...p, vencimento: e.target.value }))} className="rounded-xl" />
                  </div>
                  <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-glow" onClick={() => gerarGuia.mutate()} disabled={!guiaForm.valor || gerarGuia.isPending}>
                    {gerarGuia.isPending ? 'Gerando...' : 'Gerar Guia'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      >
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'DCTFWeb', value: dctf.length, icon: FileText, gradient: 'from-primary to-primary-glow' },
            { label: 'SEFIP', value: sefip.length, icon: Receipt, gradient: 'from-info to-info/70' },
            { label: 'Total FGTS', value: formatCurrency(totalFgts), icon: DollarSign, gradient: 'from-success to-success/70', raw: true },
            { label: 'Total INSS', value: formatCurrency(totalInss), icon: Building2, gradient: 'from-warning to-warning/70', raw: true },
            { label: 'Vencidas', value: guiasVencidas, icon: AlertTriangle, gradient: 'from-destructive to-destructive/70' },
          ].map(({ label, value, icon: Icon, gradient }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-border/30 rounded-2xl overflow-hidden">
                <div className={cn("h-[2px] bg-gradient-to-r", gradient)} />
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl bg-gradient-to-br", gradient)}><Icon className="h-4 w-4 text-primary-foreground" /></div>
                  <div><p className="text-lg font-bold font-display">{value}</p><p className="text-[10px] text-muted-foreground font-body">{label}</p></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {isLoading ? <div className="flex justify-center p-12"><Spinner size="lg" /></div> : (
          <Tabs defaultValue="fgts">
            <TabsList className="rounded-xl mb-4">
              <TabsTrigger value="fgts" className="rounded-lg font-body"><DollarSign className="h-4 w-4 mr-1" />FGTS</TabsTrigger>
              <TabsTrigger value="inss" className="rounded-lg font-body"><Building2 className="h-4 w-4 mr-1" />INSS / GPS</TabsTrigger>
              <TabsTrigger value="dctf" className="rounded-lg font-body"><FileText className="h-4 w-4 mr-1" />DCTFWeb</TabsTrigger>
              <TabsTrigger value="sefip" className="rounded-lg font-body"><Receipt className="h-4 w-4 mr-1" />SEFIP</TabsTrigger>
              <TabsTrigger value="darf" className="rounded-lg font-body"><Shield className="h-4 w-4 mr-1" />DARF / IRRF</TabsTrigger>
            </TabsList>

            {/* FGTS Tab */}
            <TabsContent value="fgts">
              <Card className="rounded-2xl border-border/30 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-display">Competência</TableHead>
                      <TableHead className="font-display">Valor</TableHead>
                      <TableHead className="font-display">Vencimento</TableHead>
                      <TableHead className="font-display">Status</TableHead>
                      <TableHead className="font-display">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guiasFgts.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8 font-body">Nenhuma guia FGTS gerada</TableCell></TableRow>
                    ) : guiasFgts.map((g: any) => {
                      const vencida = g.status !== 'paga' && g.data_vencimento && new Date(g.data_vencimento) < hoje;
                      return (
                        <TableRow key={g.id} className="hover:bg-accent/30 transition-colors">
                          <TableCell className="font-body font-medium">{g.competencia}</TableCell>
                          <TableCell className="font-body font-semibold">{g.valor ? formatCurrency(Number(g.valor)) : '—'}</TableCell>
                          <TableCell className="font-body text-sm">
                            {g.data_vencimento ? (
                              <span className={cn(vencida && 'text-destructive font-semibold')}>
                                {new Date(g.data_vencimento).toLocaleDateString('pt-BR')}
                              </span>
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("font-body text-xs", statusColors[vencida ? 'vencida' : g.status] || statusColors.pendente)}>
                              {vencida ? 'Vencida' : g.status?.charAt(0).toUpperCase() + g.status?.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {g.status !== 'paga' && (
                                <Button size="sm" variant="outline" className="rounded-lg text-xs h-7" onClick={() => marcarPaga.mutate({ id: g.id, tabela: 'guias_fgts' })}>
                                  <CheckCircle className="h-3 w-3 mr-1" />Paga
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="rounded-lg text-xs h-7"><Download className="h-3 w-3" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* INSS Tab */}
            <TabsContent value="inss">
              <Card className="rounded-2xl border-border/30 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-display">Competência</TableHead>
                      <TableHead className="font-display">Valor</TableHead>
                      <TableHead className="font-display">Vencimento</TableHead>
                      <TableHead className="font-display">Status</TableHead>
                      <TableHead className="font-display">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guiasInss.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8 font-body">Nenhuma guia INSS gerada</TableCell></TableRow>
                    ) : guiasInss.map((g: any) => {
                      const vencida = g.status !== 'paga' && g.data_vencimento && new Date(g.data_vencimento) < hoje;
                      return (
                        <TableRow key={g.id} className="hover:bg-accent/30 transition-colors">
                          <TableCell className="font-body font-medium">{g.competencia}</TableCell>
                          <TableCell className="font-body font-semibold">{g.valor ? formatCurrency(Number(g.valor)) : '—'}</TableCell>
                          <TableCell className="font-body text-sm">
                            {g.data_vencimento ? (
                              <span className={cn(vencida && 'text-destructive font-semibold')}>
                                {new Date(g.data_vencimento).toLocaleDateString('pt-BR')}
                              </span>
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("font-body text-xs", statusColors[vencida ? 'vencida' : g.status] || statusColors.pendente)}>
                              {vencida ? 'Vencida' : g.status?.charAt(0).toUpperCase() + g.status?.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {g.status !== 'paga' && (
                                <Button size="sm" variant="outline" className="rounded-lg text-xs h-7" onClick={() => marcarPaga.mutate({ id: g.id, tabela: 'guias_inss' })}>
                                  <CheckCircle className="h-3 w-3 mr-1" />Paga
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="rounded-lg text-xs h-7"><Download className="h-3 w-3" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* DCTFWeb Tab */}
            <TabsContent value="dctf">
              <Card className="rounded-2xl border-border/30 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-display">Competência</TableHead>
                      <TableHead className="font-display">Status</TableHead>
                      <TableHead className="font-display">Data Envio</TableHead>
                      <TableHead className="font-display">Valor Total</TableHead>
                      <TableHead className="font-display">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dctf.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8 font-body">Nenhuma declaração DCTFWeb</TableCell></TableRow>
                    ) : dctf.map((d: any) => (
                      <TableRow key={d.id} className="hover:bg-accent/30 transition-colors">
                        <TableCell className="font-body font-medium">{d.competencia}</TableCell>
                        <TableCell><Badge className={cn("font-body text-xs", statusColors[d.status] || statusColors.pendente)}>{d.status}</Badge></TableCell>
                        <TableCell className="font-body text-sm">{d.data_envio ? new Date(d.data_envio).toLocaleDateString('pt-BR') : '—'}</TableCell>
                        <TableCell className="font-body font-semibold">{d.valor_total ? formatCurrency(Number(d.valor_total)) : '—'}</TableCell>
                        <TableCell><Button size="sm" variant="ghost" className="rounded-lg text-xs h-7"><Download className="h-3 w-3" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* SEFIP Tab */}
            <TabsContent value="sefip">
              <Card className="rounded-2xl border-border/30 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-display">Competência</TableHead>
                      <TableHead className="font-display">Status</TableHead>
                      <TableHead className="font-display">Arquivo</TableHead>
                      <TableHead className="font-display">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sefip.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8 font-body">Nenhum arquivo SEFIP</TableCell></TableRow>
                    ) : sefip.map((s: any) => (
                      <TableRow key={s.id} className="hover:bg-accent/30 transition-colors">
                        <TableCell className="font-body font-medium">{s.competencia}</TableCell>
                        <TableCell><Badge className={cn("font-body text-xs", statusColors[s.status] || statusColors.pendente)}>{s.status}</Badge></TableCell>
                        <TableCell className="font-body text-sm">{s.arquivo_url ? '✅ Disponível' : '—'}</TableCell>
                        <TableCell>
                          {s.arquivo_url && <Button size="sm" variant="ghost" className="rounded-lg text-xs h-7"><Download className="h-3 w-3 mr-1" />Baixar</Button>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* DARF Tab */}
            <TabsContent value="darf">
              <div className="space-y-4">
                <Card className="rounded-2xl border-border/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-display flex items-center gap-2">
                      <Shield className="h-4 w-4 text-warning" />DARF — Documento de Arrecadação de Receitas Federais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-border/30 rounded-xl">
                        <CardContent className="p-4 text-center">
                          <p className="text-xs text-muted-foreground font-body mb-1">IRRF (Código 0561)</p>
                          <p className="text-xl font-bold font-display text-warning">
                            {formatCurrency(guiasInss.reduce((a: number, g: any) => a + (g.valor || 0) * 0.15, 0))}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-body mt-1">Venc. dia 20 do mês seguinte</p>
                        </CardContent>
                      </Card>
                      <Card className="border-border/30 rounded-xl">
                        <CardContent className="p-4 text-center">
                          <p className="text-xs text-muted-foreground font-body mb-1">PIS/COFINS (Código 8109)</p>
                          <p className="text-xl font-bold font-display text-info">
                            {formatCurrency(totalFgts * 0.065 + totalInss * 0.03)}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-body mt-1">Venc. dia 25 do mês seguinte</p>
                        </CardContent>
                      </Card>
                      <Card className="border-border/30 rounded-xl">
                        <CardContent className="p-4 text-center">
                          <p className="text-xs text-muted-foreground font-body mb-1">CSLL (Código 2372)</p>
                          <p className="text-xl font-bold font-display text-primary">
                            {formatCurrency(totalInss * 0.09)}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-body mt-1">Venc. último dia útil do mês</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="mt-4 p-3 bg-muted/30 rounded-xl">
                      <p className="text-xs text-muted-foreground font-body flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-warning" />
                        Os valores de DARF são estimativas baseadas nos encargos da folha. Consulte seu contador para valores exatos.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </PageLayout>
    </>
  );
}
