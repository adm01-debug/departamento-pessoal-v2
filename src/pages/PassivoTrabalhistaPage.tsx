import { PageTitle } from '@/components/PageTitle';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Scale, AlertTriangle, Calendar, TrendingUp, Info, Download, 
  RefreshCw, Users, DollarSign, PieChart, ShieldAlert, Clock,
  ArrowRight, Landmark
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks/useEmpresas';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell, Legend, PieChart as RePieChart, Pie, AreaChart, Area
} from 'recharts';
import { format, addMonths, differenceInDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

export default function PassivoTrabalhistaPage() {
  const { empresaAtualId } = useEmpresas();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['passivo-trabalhista', empresaAtualId],
    enabled: !!empresaAtualId,
    queryFn: async () => {
      // 1. Get Collaborators with salaries
      const { data: colabs } = await supabase
        .from('colaboradores')
        .select('id, nome_completo, salario_base, data_admissao, status')
        .eq('empresa_id', empresaAtualId!)
        .eq('status', 'ativo');

      // 2. Get Vacations
      const { data: ferias } = await supabase
        .from('ferias')
        .select('*')
        .eq('empresa_id', empresaAtualId!)
        .neq('status', 'cancelado');

      if (!colabs) return null;

      const hoje = new Date();
      let totalVacationLiability = 0;
      let total13thLiability = 0;
      const riskEmployees: any[] = [];

      colabs.forEach(c => {
        const salario = Number(c.salario_base || 0);
        if (salario === 0) return;

        // Pro-rated 13th Salary (from Jan 1st of current year)
        const startOfYear = new Date(hoje.getFullYear(), 0, 1);
        const admissionDate = new Date(c.data_admissao);
        const calculationStart = admissionDate > startOfYear ? admissionDate : startOfYear;
        
        // Months elapsed in current year
        const months = hoje.getMonth() - calculationStart.getMonth() + (12 * (hoje.getFullYear() - calculationStart.getFullYear())) + 1;
        const accrued13th = (salario / 12) * Math.min(months, 12);
        total13thLiability += accrued13th;

        // Simplified Vacation Accrual
        // In a real scenario, we'd check 'periodo_aquisitivo' tables
        // For this dashboard, we'll estimate based on admission date vs last taken vacation
        const employeeFerias = ferias?.filter(f => f.colaborador_id === c.id) || [];
        const lastFeriasEnd = employeeFerias.length > 0 
          ? new Date(Math.max(...employeeFerias.map(f => new Date(f.data_fim).getTime())))
          : admissionDate;

        const daysSinceLastFerias = differenceInDays(hoje, lastFeriasEnd);
        const accruedVacationDays = Math.floor(daysSinceLastFerias / 30) * 2.5; // 30 days per year
        
        const vacationCost = (salario / 30) * accruedVacationDays;
        const vacationThird = vacationCost / 3;
        totalVacationLiability += (vacationCost + vacationThird);

        // Check for double payment risk (more than 1 year and 11 months since last vacation/admission)
        if (daysSinceLastFerias > 630) { // ~21 months
          riskEmployees.push({
            id: c.id,
            nome: c.nome_completo,
            diasAtraso: daysSinceLastFerias,
            custoEstimado: (vacationCost + vacationThird) * 2, // Potential double penalty
            nivel: daysSinceLastFerias > 700 ? 'critico' : 'alerta'
          });
        }
      });

      // Charges estimation (INSS Patronal + FGTS ~ 35%)
      const totalCharges = (totalVacationLiability + total13thLiability) * 0.35;

      return {
        totalLiability: totalVacationLiability + total13thLiability + totalCharges,
        vacationLiability: totalVacationLiability,
        thirteenthLiability: total13thLiability,
        chargesLiability: totalCharges,
        riskEmployees: riskEmployees.sort((a, b) => b.diasAtraso - a.diasAtraso),
        distribution: [
          { name: 'Férias + 1/3', value: totalVacationLiability },
          { name: '13º Salário', value: total13thLiability },
          { name: 'Encargos (INSS/FGTS)', value: totalCharges },
        ],
        projection: Array.from({ length: 6 }).map((_, i) => {
          const d = addMonths(hoje, i);
          return {
            mes: format(d, 'MMM/yy', { locale: ptBR }),
            valor: (totalVacationLiability + total13thLiability + totalCharges) * (1 + (i * 0.02)) // 2% growth estimate
          };
        })
      };
    }
  });

  const formatCurrency = (v: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <PageLayout 
      title="Passivo Trabalhista" 
      description="Análise estratégica de obrigações e riscos financeiros de pessoal"
      icon={<Scale className="h-5 w-5 text-primary-foreground" />}
      gradient="from-destructive to-destructive-glow"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl">
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Atualizar
          </Button>
          <Button size="sm" className="rounded-xl shadow-lg bg-destructive hover:bg-destructive/90" onClick={() => toast.info('Gerando relatório detalhado...')}>
            <Download className="h-4 w-4 mr-2" />
            Relatório PDF
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Passivo Total Estimado', value: data?.totalLiability || 0, icon: DollarSign, gradient: 'from-destructive to-destructive/70', desc: 'Soma de Férias, 13º e Encargos' },
          { label: 'Risco de Multa (Férias)', value: data?.riskEmployees.length || 0, icon: ShieldAlert, gradient: 'from-warning to-warning/70', desc: 'Colaboradores com férias vencendo' },
          { label: 'Provisão 13º Acumulada', value: data?.thirteenthLiability || 0, icon: Clock, gradient: 'from-primary to-primary/70', desc: 'Valor pro-rata até hoje' },
          { label: 'Encargos Provisionados', value: data?.chargesLiability || 0, icon: Landmark, gradient: 'from-info to-info/70', desc: 'Estimativa de impostos sobre o passivo' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border border-border/30 rounded-2xl overflow-hidden shadow-sm h-full">
              <div className={cn("h-1 bg-gradient-to-r", kpi.gradient)} />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("p-2 rounded-xl bg-gradient-to-br", kpi.gradient)}>
                    <kpi.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  {kpi.label.includes('Risco') && (data?.riskEmployees.length || 0) > 0 && (
                    <Badge variant="destructive" className="animate-pulse">Crítico</Badge>
                  )}
                </div>
                <h3 className="text-2xl font-display font-bold truncate">
                  {typeof kpi.value === 'number' && kpi.label.includes('Total') || kpi.label.includes('Provisão') || kpi.label.includes('Encargos') 
                    ? formatCurrency(kpi.value) 
                    : kpi.value}
                </h3>
                <p className="text-xs font-medium text-foreground/80 mt-1">{kpi.label}</p>
                <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                  <Info className="h-3 w-3" /> {kpi.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 border border-border/30 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-display flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-destructive" />
              Projeção de Evolução do Passivo (6 Meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.projection || []}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <RechartsTooltip 
                    formatter={(v: any) => formatCurrency(v)}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Area type="monotone" dataKey="valor" stroke="hsl(var(--destructive))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-muted/30 rounded-xl border border-border/20">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-info" />
                A projeção considera o crescimento natural do passivo (férias e 13º) e uma estimativa de 2% de reajustes ou novas admissões mensais.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/30 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-display flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Composição do Passivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={data?.distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data?.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v: any) => formatCurrency(v)} />
                  <Legend verticalAlign="bottom" height={36}/>
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {data?.distribution.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/30 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/30">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Radar de Risco: Férias Próximas ao Dobro
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!data?.riskEmployees.length ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <ShieldAlert className="h-6 w-6 text-success" />
              </div>
              <p className="text-sm font-medium">Nenhum risco crítico detectado!</p>
              <p className="text-xs text-muted-foreground mt-1">Todos os colaboradores estão com férias em dia ou dentro do prazo legal.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/20 text-muted-foreground font-medium border-b border-border/20">
                    <th className="px-4 py-3 text-left">Colaborador</th>
                    <th className="px-4 py-3 text-center">Dias sem Férias</th>
                    <th className="px-4 py-3 text-right">Passivo Estimado</th>
                    <th className="px-4 py-3 text-right">Potencial Multa (Dobro)</th>
                    <th className="px-4 py-3 text-center">Nível</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.riskEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b border-border/10 hover:bg-muted/10 transition-colors group">
                      <td className="px-4 py-3 font-medium">{emp.nome}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center">
                          <span>{emp.diasAtraso} dias</span>
                          <Progress value={Math.min(100, (emp.diasAtraso / 730) * 100)} className={cn("h-1 w-20 mt-1", emp.nivel === 'critico' ? "bg-destructive/20" : "bg-warning/20")} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{formatCurrency(emp.custoEstimado / 2)}</td>
                      <td className="px-4 py-3 text-right font-bold text-destructive">{formatCurrency(emp.custoEstimado)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={emp.nivel === 'critico' ? 'destructive' : 'outline'} className={cn(emp.nivel === 'alerta' && "border-warning text-warning")}>
                          {emp.nivel === 'critico' ? 'Crítico' : 'Alerta'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 group-hover:bg-primary group-hover:text-primary-foreground">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
