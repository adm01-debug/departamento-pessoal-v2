import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresa } from '@/contexts';
import { Shield, HardHat, Stethoscope, AlertTriangle, CheckCircle, Clock, Activity, FileText, Users, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CHART_COLORS = ['hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--info))', 'hsl(var(--primary))'];

const RISCOS_NR = [
  { nr: 'NR-6', titulo: 'EPI', descricao: 'Equipamento de Proteção Individual', nivel: 'obrigatória' },
  { nr: 'NR-7', titulo: 'PCMSO', descricao: 'Programa de Controle Médico de Saúde Ocupacional', nivel: 'obrigatória' },
  { nr: 'NR-9', titulo: 'PGR', descricao: 'Programa de Gerenciamento de Riscos', nivel: 'obrigatória' },
  { nr: 'NR-15', titulo: 'Insalubridade', descricao: 'Atividades e Operações Insalubres', nivel: 'condicional' },
  { nr: 'NR-16', titulo: 'Periculosidade', descricao: 'Atividades e Operações Perigosas', nivel: 'condicional' },
  { nr: 'NR-17', titulo: 'Ergonomia', descricao: 'Condições ergonômicas no ambiente de trabalho', nivel: 'obrigatória' },
  { nr: 'NR-35', titulo: 'Trabalho em Altura', descricao: 'Trabalho acima de 2 metros', nivel: 'condicional' },
];

export default function SSTPage() {
  const { empresaAtual } = useEmpresa();

  const { data: asos = [], isLoading: loadAsos } = useQuery({
    queryKey: ['sst_asos', empresaAtual?.id],
    enabled: !!empresaAtual?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from('asos')
        .select('*, colaborador:colaboradores(nome_completo, departamento)')
        .eq('empresa_id', empresaAtual!.id)
        .order('data_validade', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: epis = [] } = useQuery({
    queryKey: ['sst_epis', empresaAtual?.id],
    enabled: !!empresaAtual?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from('epis').select('*').eq('empresa_id', empresaAtual!.id);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: entregas = [] } = useQuery({
    queryKey: ['sst_entregas', empresaAtual?.id],
    enabled: !!empresaAtual?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from('epis_entregas')
        .select('*, colaborador:colaboradores(nome_completo), epi:epis(nome, ca)')
        .order('data_entrega', { ascending: false }).limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const hoje = new Date();
  const em30dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);

  const stats = useMemo(() => {
    const vencidos = asos.filter((a: any) => a.data_validade && new Date(a.data_validade) < hoje).length;
    const vencendo = asos.filter((a: any) => {
      if (!a.data_validade) return false;
      const dv = new Date(a.data_validade);
      return dv >= hoje && dv <= em30dias;
    }).length;
    const validos = asos.filter((a: any) => a.data_validade && new Date(a.data_validade) > em30dias).length;

    // ASOs by type
    const tipoMap = new Map<string, number>();
    asos.forEach((a: any) => tipoMap.set(a.tipo, (tipoMap.get(a.tipo) || 0) + 1));
    const porTipo = Array.from(tipoMap.entries()).map(([name, value]) => ({ name, value }));

    // ASOs by department
    const deptMap = new Map<string, number>();
    asos.forEach((a: any) => {
      const dept = a.colaborador?.departamento || 'Sem Depto';
      deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
    });
    const porDepartamento = Array.from(deptMap.entries()).map(([name, value]) => ({ name, value }));

    return { vencidos, vencendo, validos, total: asos.length, porTipo, porDepartamento, totalEpis: epis.length, totalEntregas: entregas.length };
  }, [asos, epis, entregas]);

  return (
    <PageLayout
      title="Saúde e Segurança do Trabalho"
      description="Gestão SST: exames, EPIs, riscos e NRs"
      icon={<Shield className="h-5 w-5 text-primary-foreground" />}
      gradient="from-success to-info"
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'ASOs Válidos', value: stats.validos, icon: CheckCircle, gradient: 'from-success to-success/70' },
          { label: 'Vencendo 30d', value: stats.vencendo, icon: Clock, gradient: 'from-warning to-warning/70' },
          { label: 'Vencidos', value: stats.vencidos, icon: AlertTriangle, gradient: 'from-destructive to-destructive/70' },
          { label: 'EPIs Cadastrados', value: stats.totalEpis, icon: HardHat, gradient: 'from-info to-info/70' },
          { label: 'Entregas EPI', value: stats.totalEntregas, icon: Users, gradient: 'from-primary to-primary-glow' },
        ].map(({ label, value, icon: Icon, gradient }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/30 rounded-2xl">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={cn("p-2 rounded-xl bg-gradient-to-br", gradient)}><Icon className="h-4 w-4 text-primary-foreground" /></div>
                <div><p className="text-lg font-bold font-display">{value}</p><p className="text-[10px] text-muted-foreground font-body">{label}</p></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="exames">
        <TabsList className="rounded-xl mb-4">
          <TabsTrigger value="exames" className="rounded-lg font-body">🩺 Exames / ASOs</TabsTrigger>
          <TabsTrigger value="epis" className="rounded-lg font-body">🦺 EPIs</TabsTrigger>
          <TabsTrigger value="riscos" className="rounded-lg font-body">⚠️ Matriz de Riscos</TabsTrigger>
          <TabsTrigger value="nrs" className="rounded-lg font-body">📋 NRs</TabsTrigger>
        </TabsList>

        <TabsContent value="exames">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card className="border-border/30 rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-display">ASOs por Tipo</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={stats.porTipo} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {stats.porTipo.map((_: any, i: number) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-border/30 rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-display">ASOs por Departamento</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.porDepartamento.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--info))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {loadAsos ? <div className="flex justify-center p-8"><Spinner size="lg" /></div> : (
            <Card className="rounded-2xl border-border/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-display">Colaborador</TableHead>
                    <TableHead className="font-display">Tipo</TableHead>
                    <TableHead className="font-display">Data Exame</TableHead>
                    <TableHead className="font-display">Validade</TableHead>
                    <TableHead className="font-display">Status</TableHead>
                    <TableHead className="font-display">Médico</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asos.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8 font-body">Nenhum ASO cadastrado</TableCell></TableRow>
                  ) : asos.slice(0, 50).map((aso: any) => {
                    const vencido = aso.data_validade && new Date(aso.data_validade) < hoje;
                    const vencendoBreve = aso.data_validade && !vencido && new Date(aso.data_validade) <= em30dias;
                    return (
                      <TableRow key={aso.id} className="hover:bg-accent/30 transition-colors">
                        <TableCell className="font-body font-medium">{aso.colaborador?.nome_completo || '—'}</TableCell>
                        <TableCell><Badge variant="outline" className="font-body text-xs">{aso.tipo}</Badge></TableCell>
                        <TableCell className="text-sm font-body">{aso.data_exame ? new Date(aso.data_exame).toLocaleDateString('pt-BR') : '—'}</TableCell>
                        <TableCell className="text-sm font-body">{aso.data_validade ? new Date(aso.data_validade).toLocaleDateString('pt-BR') : '—'}</TableCell>
                        <TableCell>
                          <Badge className={cn("border-0 font-body", vencido ? 'bg-destructive/15 text-destructive' : vencendoBreve ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success')}>
                            {vencido ? 'Vencido' : vencendoBreve ? 'Vencendo' : 'Válido'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-body">{aso.medico_nome || '—'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="epis">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {epis.length === 0 ? (
              <Card className="col-span-full rounded-2xl border-border/30"><CardContent className="py-12 text-center text-muted-foreground font-body"><HardHat className="mx-auto h-12 w-12 mb-4 opacity-30" /><p>Nenhum EPI cadastrado</p><p className="text-xs mt-1">Cadastre EPIs na página de EPIs</p></CardContent></Card>
            ) : epis.map((epi: any, i: number) => (
              <motion.div key={epi.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="border-border/30 rounded-2xl hover:shadow-elevated transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <HardHat className="h-5 w-5 text-info" />
                        <div>
                          <p className="font-display font-semibold text-sm">{epi.nome}</p>
                          <p className="text-[10px] text-muted-foreground font-body">CA: {epi.ca || '—'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-body">{epi.categoria}</Badge>
                    </div>
                    {epi.validade_meses && (
                      <div className="mt-2">
                        <p className="text-[10px] text-muted-foreground font-body">Validade: {epi.validade_meses} meses</p>
                        <Progress value={Math.min(100, (epi.validade_meses / 12) * 100)} className="h-1.5 mt-1" />
                      </div>
                    )}
                    {epi.estoque_minimo && (
                      <p className="text-[10px] text-muted-foreground font-body mt-1">Estoque mínimo: {epi.estoque_minimo}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {entregas.length > 0 && (
            <Card className="rounded-2xl border-border/30 overflow-hidden mt-4">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-display">Últimas Entregas de EPI</CardTitle></CardHeader>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-display">Colaborador</TableHead>
                    <TableHead className="font-display">EPI</TableHead>
                    <TableHead className="font-display">CA</TableHead>
                    <TableHead className="font-display">Data Entrega</TableHead>
                    <TableHead className="font-display">Qtd</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entregas.slice(0, 20).map((e: any) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-body text-sm">{e.colaborador?.nome_completo || '—'}</TableCell>
                      <TableCell className="font-body text-sm">{e.epi?.nome || '—'}</TableCell>
                      <TableCell className="font-body text-xs text-muted-foreground">{e.epi?.ca || '—'}</TableCell>
                      <TableCell className="font-body text-sm">{e.data_entrega ? new Date(e.data_entrega).toLocaleDateString('pt-BR') : '—'}</TableCell>
                      <TableCell className="font-body text-sm">{e.quantidade || 1}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="riscos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { tipo: 'Físico', exemplos: ['Ruído', 'Vibração', 'Calor', 'Frio', 'Radiação'], cor: 'from-info to-info/70', icon: Activity },
              { tipo: 'Químico', exemplos: ['Poeiras', 'Gases', 'Vapores', 'Névoas'], cor: 'from-warning to-warning/70', icon: Flame },
              { tipo: 'Biológico', exemplos: ['Vírus', 'Bactérias', 'Fungos', 'Parasitas'], cor: 'from-success to-success/70', icon: Stethoscope },
              { tipo: 'Ergonômico', exemplos: ['Postura inadequada', 'Repetitividade', 'Esforço físico'], cor: 'from-primary to-primary-glow', icon: Users },
              { tipo: 'Acidente', exemplos: ['Queda', 'Choque elétrico', 'Incêndio', 'Máquinas'], cor: 'from-destructive to-destructive/70', icon: AlertTriangle },
            ].map(({ tipo, exemplos, cor, icon: Icon }, i) => (
              <motion.div key={tipo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="border-border/30 rounded-2xl overflow-hidden">
                  <div className={cn("h-[2px] bg-gradient-to-r", cor)} />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn("p-2 rounded-xl bg-gradient-to-br", cor)}><Icon className="h-4 w-4 text-primary-foreground" /></div>
                      <div>
                        <p className="font-display font-semibold text-sm">Risco {tipo}</p>
                        <p className="text-[10px] text-muted-foreground font-body">{exemplos.length} agentes identificados</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {exemplos.map(ex => (
                        <Badge key={ex} variant="outline" className="text-[10px] font-body">{ex}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nrs">
          <div className="space-y-3">
            {RISCOS_NR.map((nr, i) => (
              <motion.div key={nr.nr} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="border-border/30 rounded-2xl hover:shadow-elevated transition-all">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-glow">
                      <FileText className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-display font-bold text-sm">{nr.nr}</p>
                        <p className="font-display font-semibold text-sm">— {nr.titulo}</p>
                      </div>
                      <p className="text-xs text-muted-foreground font-body">{nr.descricao}</p>
                    </div>
                    <Badge className={cn("border-0 font-body", nr.nivel === 'obrigatória' ? 'bg-destructive/15 text-destructive' : 'bg-warning/15 text-warning')}>
                      {nr.nivel}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
