import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICardSkeleton } from '@/components/ui/module-skeleton';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useEmpresas } from '@/hooks/useEmpresas';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Calendar, Clock,
  ArrowUpRight, ArrowDownRight, Building2, Briefcase, Target, PieChart,
  Download, RefreshCw, AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Line } from 'recharts';
import { useState, useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--info))', 'hsl(var(--destructive))', 'hsl(var(--accent))'];

function useExecutiveKPIs(empresaId?: string, periodo: string = '6') {
  return useQuery({
    queryKey: ['executive-kpis', empresaId, periodo],
    enabled: !!empresaId,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const meses = parseInt(periodo);
      const hoje = new Date();

      // Colaboradores ativos
      const { count: totalAtivos } = await supabase.from('colaboradores').select('*', { count: 'exact', head: true }).eq('status', 'ativo').eq('empresa_id', empresaId!);

      // Admissões e demissões por mês
      const evolucao = [];
      for (let i = meses - 1; i >= 0; i--) {
        const mesRef = subMonths(hoje, i);
        const inicio = format(startOfMonth(mesRef), 'yyyy-MM-dd');
        const fim = format(endOfMonth(mesRef), 'yyyy-MM-dd');
        const label = format(mesRef, 'MMM/yy', { locale: ptBR });

        const { count: admissoes } = await supabase.from('colaboradores').select('*', { count: 'exact', head: true }).eq('empresa_id', empresaId!).gte('data_admissao', inicio).lte('data_admissao', fim);
        const { count: demissoes } = await supabase.from('desligamentos').select('*', { count: 'exact', head: true }).eq('empresa_id', empresaId!).gte('data_desligamento', inicio).lte('data_desligamento', fim);

        evolucao.push({ mes: label, admissoes: admissoes || 0, demissoes: demissoes || 0, saldo: (admissoes || 0) - (demissoes || 0) });
      }

      // Distribuição por departamento
      const { data: colabs } = await supabase.from('colaboradores').select('departamento').eq('status', 'ativo').eq('empresa_id', empresaId!);
      const deptMap: Record<string, number> = {};
      colabs?.forEach(c => { deptMap[c.departamento] = (deptMap[c.departamento] || 0) + 1; });
      const departamentos = Object.entries(deptMap).map(([nome, value]) => ({ nome, value })).sort((a, b) => b.value - a.value).slice(0, 8);

      // Folha mensal
      const mesAtual = format(hoje, 'yyyy-MM');
      const mesAnterior = format(subMonths(hoje, 1), 'yyyy-MM');
      const { data: folhaAtual } = await supabase.from('folhas_pagamento').select('total_liquido').eq('competencia', mesAtual).eq('empresa_id', empresaId!);
      const { data: folhaAnterior } = await supabase.from('folhas_pagamento').select('total_liquido').eq('competencia', mesAnterior).eq('empresa_id', empresaId!);
      const totalFolhaAtual = folhaAtual?.reduce((s, f) => s + (f.total_liquido || 0), 0) || 0;
      const totalFolhaAnterior = folhaAnterior?.reduce((s, f) => s + (f.total_liquido || 0), 0) || 0;
      const variacaoFolha = totalFolhaAnterior > 0 ? ((totalFolhaAtual - totalFolhaAnterior) / totalFolhaAnterior * 100) : 0;

      // Custos por mês
      const custosMensal = [];
      for (let i = meses - 1; i >= 0; i--) {
        const mesRef = subMonths(hoje, i);
        const comp = format(mesRef, 'yyyy-MM');
        const label = format(mesRef, 'MMM/yy', { locale: ptBR });
      const { data: fl } = await supabase.from('folhas_pagamento').select('total_proventos, total_liquido, total_descontos').eq('competencia', comp).eq('empresa_id', empresaId!);
        const bruto = fl?.reduce((s, f) => s + (f.total_proventos || 0), 0) || 0;
        const liquido = fl?.reduce((s, f) => s + (f.total_liquido || 0), 0) || 0;
        const descontos = fl?.reduce((s, f) => s + (f.total_descontos || 0), 0) || 0;
        custosMensal.push({ mes: label, bruto, liquido, descontos });
      }

      // Férias pendentes
      const { count: feriasPendentes } = await supabase.from('ferias').select('*', { count: 'exact', head: true }).eq('status', 'pendente').eq('empresa_id', empresaId!);
      // Afastamentos ativos
      const { count: afastamentosAtivos } = await supabase.from('afastamentos').select('*', { count: 'exact', head: true }).in('status', ['aprovado', 'em_andamento']).eq('empresa_id', empresaId!);

      // Custo médio por colaborador
      const custoMedio = totalAtivos && totalAtivos > 0 ? totalFolhaAtual / totalAtivos : 0;

      // Turnover
      const demissoesPeriodo = evolucao.reduce((s, e) => s + e.demissoes, 0);
      const turnover = totalAtivos && totalAtivos > 0 ? (demissoesPeriodo / totalAtivos * 100) : 0;

      // Absenteísmo (registros com falta)
      const inicioMes = format(startOfMonth(hoje), 'yyyy-MM-dd');
      const { count: diasFalta } = await supabase.from('registros_ponto').select('*', { count: 'exact', head: true }).eq('empresa_id', empresaId!).gte('data', inicioMes).gt('horas_falta', '00:00:00');
      const absenteismo = totalAtivos && totalAtivos > 0 ? ((diasFalta || 0) / (totalAtivos * 22) * 100) : 0;

      return {
        totalAtivos: totalAtivos || 0, evolucao, departamentos, custosMensal,
        totalFolhaAtual, variacaoFolha, feriasPendentes: feriasPendentes || 0,
        afastamentosAtivos: afastamentosAtivos || 0, custoMedio, turnover, absenteismo,
      };
    },
  });
}

export default function DashboardExecutivoPage() {
  const { empresaAtualId } = useEmpresas();
  const [periodo, setPeriodo] = useState('6');
  const { data, isLoading, refetch } = useExecutiveKPIs(empresaAtualId, periodo);

  const kpis = [
    { label: 'Headcount', value: data?.totalAtivos || 0, icon: Users, gradient: 'from-primary to-primary-glow', format: 'number' },
    { label: 'Folha Mensal', value: data?.totalFolhaAtual || 0, icon: DollarSign, gradient: 'from-success to-success/70', format: 'currency', delta: data?.variacaoFolha },
    { label: 'Custo/Colaborador', value: data?.custoMedio || 0, icon: Target, gradient: 'from-warning to-warning/70', format: 'currency' },
    { label: 'Turnover', value: data?.turnover || 0, icon: TrendingDown, gradient: 'from-destructive to-destructive/70', format: 'percent', alert: (data?.turnover || 0) > 10 },
    { label: 'Absenteísmo', value: data?.absenteismo || 0, icon: Clock, gradient: 'from-info to-info/70', format: 'percent', alert: (data?.absenteismo || 0) > 5 },
    { label: 'Férias Pendentes', value: data?.feriasPendentes || 0, icon: Calendar, gradient: 'from-warning to-warning/70', format: 'number' },
  ];

  const formatValue = (v: number, fmt: string) => {
    if (fmt === 'currency') return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    if (fmt === 'percent') return `${v.toFixed(1)}%`;
    return v.toString();
  };

  return (
    <PageLayout title="Dashboard Executivo" description="Indicadores estratégicos de RH"
      icon={<BarChart3 className="h-5 w-5 text-primary-foreground" />} gradient="from-primary to-primary-glow"
      actions={
        <div className="flex gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[140px] rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl"><RefreshCw className="h-4 w-4" /></Button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {isLoading ? Array.from({ length: 6 }).map((_, i) => <KPICardSkeleton key={i} />) :
          kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border border-border/30 rounded-2xl overflow-hidden h-full">
                <div className={cn("h-[2px] bg-gradient-to-r", kpi.gradient)} />
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("p-1.5 rounded-lg bg-gradient-to-br", kpi.gradient)}>
                      <kpi.icon className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                    {kpi.alert && <AlertTriangle className="h-3.5 w-3.5 text-destructive animate-pulse" />}
                  </div>
                  <p className="text-xl font-display font-bold">{formatValue(kpi.value, kpi.format)}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground font-body">{kpi.label}</p>
                    {kpi.delta !== undefined && (
                      <Badge variant={kpi.delta >= 0 ? 'default' : 'destructive'} className="text-[9px] px-1.5">
                        {kpi.delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(kpi.delta).toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        }
      </div>

      <Tabs defaultValue="evolucao">
        <TabsList className="mb-4">
          <TabsTrigger value="evolucao"><TrendingUp className="mr-1 h-4 w-4" />Evolução</TabsTrigger>
          <TabsTrigger value="custos"><DollarSign className="mr-1 h-4 w-4" />Custos</TabsTrigger>
          <TabsTrigger value="estrutura"><Building2 className="mr-1 h-4 w-4" />Estrutura</TabsTrigger>
        </TabsList>

        <TabsContent value="evolucao">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-border/30 rounded-2xl">
              <CardHeader><CardTitle className="text-sm font-display">Admissões vs Desligamentos</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={data?.evolucao || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Legend />
                    <Bar dataKey="admissoes" name="Admissões" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="demissoes" name="Demissões" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    <Line dataKey="saldo" name="Saldo" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-border/30 rounded-2xl">
              <CardHeader><CardTitle className="text-sm font-display">Turnover Mensal (%)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data?.evolucao?.map(e => ({ ...e, turnover: data.totalAtivos > 0 ? (e.demissoes / data.totalAtivos * 100).toFixed(1) : 0 })) || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="turnover" name="Turnover %" fill="hsl(var(--destructive) / 0.2)" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custos">
          <Card className="border border-border/30 rounded-2xl">
            <CardHeader><CardTitle className="text-sm font-display">Evolução de Custos com Pessoal</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={data?.custosMensal || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$ ${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} formatter={(v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                  <Legend />
                  <Area type="monotone" dataKey="bruto" name="Bruto" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="liquido" name="Líquido" stroke="hsl(var(--success))" strokeWidth={2} />
                  <Bar dataKey="descontos" name="Descontos" fill="hsl(var(--warning) / 0.5)" radius={[2, 2, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estrutura">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-border/30 rounded-2xl">
              <CardHeader><CardTitle className="text-sm font-display">Distribuição por Departamento</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie data={data?.departamentos || []} dataKey="value" nameKey="nome" cx="50%" cy="50%" outerRadius={100} label={({ nome, value }) => `${nome} (${value})`}>
                      {data?.departamentos?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-border/30 rounded-2xl">
              <CardHeader><CardTitle className="text-sm font-display">Headcount por Departamento</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.departamentos || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="nome" type="category" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Bar dataKey="value" name="Colaboradores" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
