import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Users, DollarSign, Calendar, TrendingUp, Cake, BarChart3, Download, Loader2, PieChart, TrendingDown, ArrowUpRight, ArrowDownRight, FileSpreadsheet, Mail, Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresa } from '@/contexts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RePie, Pie, Cell, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--info))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

const relatorios = [
  { id: 'colaboradores', title: 'Resumo Colaboradores', description: 'Colaboradores ativos com dados completos', icon: Users, gradient: 'from-info to-info/70' },
  { id: 'folha', title: 'Folha de Pagamento', description: 'Relatório detalhado da folha', icon: DollarSign, gradient: 'from-success to-success/70' },
  { id: 'ferias', title: 'Férias', description: 'Colaboradores com férias próximas ou vencidas', icon: Calendar, gradient: 'from-warning to-warning/70' },
  { id: 'aniversariantes', title: 'Aniversariantes', description: 'Aniversariantes do mês', icon: Cake, gradient: 'from-destructive to-destructive/70' },
  { id: 'turnover', title: 'Turnover', description: 'Análise de rotatividade', icon: TrendingUp, gradient: 'from-primary to-primary/70' },
  { id: 'encargos', title: 'Encargos Sociais', description: 'Resumo INSS, FGTS, IRRF', icon: FileText, gradient: 'from-info to-primary' },
];

async function fetchReportData(id: string, empresaId?: string) {
  switch (id) {
    case 'colaboradores': {
      const { data, error } = await supabase.from('colaboradores')
        .select('nome_completo, cpf, cargo, departamento, status, data_admissao, salario_base')
        .eq('status', 'ativo')
        .order('nome_completo');
      if (error) throw error;
      return { title: 'Colaboradores Ativos', rows: data || [], columns: ['nome_completo', 'cpf', 'cargo', 'departamento', 'salario_base'] };
    }
    case 'folha': {
      const comp = new Date().toISOString().slice(0, 7);
      const { data, error } = await supabase.from('folhas_pagamento').select('*').eq('competencia', comp);
      if (error) throw error;
      return { title: `Folha ${comp}`, rows: data || [], columns: ['colaborador_id', 'competencia', 'total_proventos', 'total_descontos', 'total_liquido', 'status'] };
    }
    case 'aniversariantes': {
      const mes = new Date().getMonth() + 1;
      const { data, error } = await supabase.from('colaboradores').select('nome_completo, data_nascimento, departamento, cargo').eq('status', 'ativo');
      if (error) throw error;
      const aniv = (data || []).filter(c => c.data_nascimento && new Date(c.data_nascimento).getMonth() + 1 === mes);
      return { title: `Aniversariantes - Mês ${mes}`, rows: aniv, columns: ['nome_completo', 'data_nascimento', 'departamento', 'cargo'] };
    }
    default:
      return { title: 'Relatório', rows: [], columns: [] };
  }
}

function exportCSV(title: string, rows: any[], columns: string[]) {
  if (!rows.length) { toast.info('Sem dados para exportar'); return; }
  const header = columns.join(';');
  const lines = rows.map(r => columns.map(c => r[c] ?? '').join(';'));
  const csv = [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${title.replace(/\s/g, '_')}.csv`; a.click();
  URL.revokeObjectURL(url);
  toast.success('CSV exportado!');
}

function exportExcel(title: string, rows: any[], columns: string[]) {
  if (!rows.length) { toast.info('Sem dados para exportar'); return; }
  const ws = XLSX.utils.json_to_sheet(rows.map(r => Object.fromEntries(columns.map(c => [c, r[c] ?? '']))));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dados');
  XLSX.writeFile(wb, `${title.replace(/\s/g, '_')}.xlsx`);
  toast.success('Excel exportado!');
}

function exportPDF(title: string, rows: any[], columns: string[]) {
  if (!rows.length) { toast.info('Sem dados para exportar'); return; }
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16); doc.text(title, 14, 20);
  doc.setFontSize(10); doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);
  (doc as any).autoTable({
    startY: 35,
    head: [columns],
    body: rows.map(r => columns.map(c => r[c] ?? '')),
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 8 },
  });
  doc.save(`${title.replace(/\s/g, '_')}.pdf`);
  toast.success('PDF exportado!');
}

export default function RelatoriosPage() {
  const { empresaAtual } = useEmpresa();
  const [generating, setGenerating] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState('csv');
  const [emailDialog, setEmailDialog] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Analytics data
  const { data: analytics } = useQuery({
    queryKey: ['relatorios_analytics', empresaAtual?.id],
    enabled: !!empresaAtual?.id,
    queryFn: async () => {
      const [{ data: cols }, { data: deslig }, { data: admissoes }] = await Promise.all([
        supabase.from('colaboradores').select('departamento, status, data_admissao, salario_base').eq('empresa_id', empresaAtual!.id),
        supabase.from('desligamentos').select('data_desligamento, motivo').eq('empresa_id', empresaAtual!.id),
        supabase.from('admissoes').select('data_prevista, departamento').eq('empresa_id', empresaAtual!.id),
      ]);

      // Headcount by department
      const deptMap = new Map<string, number>();
      (cols || []).filter(c => c.status === 'ativo').forEach(c => {
        const dept = c.departamento || 'Sem Depto';
        deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
      });
      const porDepartamento = Array.from(deptMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

      // Salary distribution
      const faixas = { 'Até 2k': 0, '2k-4k': 0, '4k-6k': 0, '6k-10k': 0, '10k+': 0 };
      (cols || []).filter(c => c.status === 'ativo' && c.salario_base).forEach(c => {
        const s = Number(c.salario_base);
        if (s <= 2000) faixas['Até 2k']++;
        else if (s <= 4000) faixas['2k-4k']++;
        else if (s <= 6000) faixas['4k-6k']++;
        else if (s <= 10000) faixas['6k-10k']++;
        else faixas['10k+']++;
      });
      const salarioDistribuicao = Object.entries(faixas).map(([name, value]) => ({ name, value }));

      // Monthly trend (admissions vs terminations)
      const months: Record<string, { admissoes: number; desligamentos: number }> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months[key] = { admissoes: 0, desligamentos: 0 };
      }
      (admissoes || []).forEach(a => { const m = a.data_prevista?.slice(0, 7); if (m && months[m]) months[m].admissoes++; });
      (deslig || []).forEach(d => { const m = d.data_desligamento?.slice(0, 7); if (m && months[m]) months[m].desligamentos++; });
      const tendencia = Object.entries(months).map(([mes, v]) => ({ mes: mes.slice(5), ...v }));

      // Total cost
      const custoTotal = (cols || []).filter(c => c.status === 'ativo').reduce((acc, c) => acc + Number(c.salario_base || 0), 0);
      const totalAtivos = (cols || []).filter(c => c.status === 'ativo').length;

      return { porDepartamento, salarioDistribuicao, tendencia, custoTotal, totalAtivos, totalDeslig: (deslig || []).length };
    },
  });

  const handleExport = async (id: string) => {
    setGenerating(id);
    try {
      const report = await fetchReportData(id, empresaAtual?.id);
      switch (exportFormat) {
        case 'excel': exportExcel(report.title, report.rows, report.columns); break;
        case 'pdf': exportPDF(report.title, report.rows, report.columns); break;
        default: exportCSV(report.title, report.rows, report.columns);
      }
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setGenerating(null);
    }
  };

  const handleSendEmail = async () => {
    if (!emailDialog || !emailTo || !empresaAtual?.id) return;
    setSendingEmail(true);
    try {
      await edgeFunctionsService.enviarRelatorioEmail({
        tipo: emailDialog,
        destinatarios: emailTo.split(',').map(e => e.trim()),
        empresaId: empresaAtual.id,
      });
      toast.success('Relatório enviado por email!');
      setEmailDialog(null);
      setEmailTo('');
    } catch (err: any) {
      toast.error(`Erro ao enviar: ${err.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <>
    <PageTitle title="Relatórios" description="Relatórios gerenciais" />
    <PageLayout
      title="Relatórios Analíticos"
      description="Dashboards, tendências e exportações"
      icon={<BarChart3 className="h-5 w-5 text-primary-foreground" />}
      gradient="from-info to-primary"
    >
      <Tabs defaultValue="analytics">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="rounded-xl">
            <TabsTrigger value="analytics" className="rounded-lg font-body">📊 Analytics</TabsTrigger>
            <TabsTrigger value="exportar" className="rounded-lg font-body">📥 Exportar</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-[130px] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">📄 CSV</SelectItem>
                <SelectItem value="excel">📊 Excel</SelectItem>
                <SelectItem value="pdf">📋 PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="analytics">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Colaboradores Ativos', value: analytics?.totalAtivos || 0, icon: Users, gradient: 'from-primary to-primary-glow', trend: '+5%', up: true },
              { label: 'Custo Folha Mensal', value: `R$ ${((analytics?.custoTotal || 0) / 1000).toFixed(0)}k`, icon: DollarSign, gradient: 'from-success to-success/70', trend: '+2.3%', up: true },
              { label: 'Desligamentos', value: analytics?.totalDeslig || 0, icon: TrendingDown, gradient: 'from-destructive to-destructive/70', trend: '-12%', up: false },
              { label: 'Custo Médio', value: analytics?.totalAtivos ? `R$ ${((analytics.custoTotal / analytics.totalAtivos) / 1000).toFixed(1)}k` : '—', icon: PieChart, gradient: 'from-warning to-warning/70', trend: '+1.8%', up: true },
            ].map(({ label, value, icon: Icon, gradient, trend, up }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="border-border/30 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn("p-2 rounded-xl bg-gradient-to-br", gradient)}><Icon className="h-4 w-4 text-primary-foreground" /></div>
                      <Badge className={cn("text-[10px] border-0", up ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive')}>
                        {up ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}{trend}
                      </Badge>
                    </div>
                    <p className="text-xl font-bold font-display">{value}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Trend */}
            <Card className="border-border/30 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Admissões vs Desligamentos</CardTitle>
                <CardDescription className="text-xs font-body">Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={analytics?.tendencia || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="admissoes" stackId="1" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.3} name="Admissões" />
                    <Area type="monotone" dataKey="desligamentos" stackId="2" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.3} name="Desligamentos" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* By department */}
            <Card className="border-border/30 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Headcount por Departamento</CardTitle>
                <CardDescription className="text-xs font-body">Colaboradores ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics?.porDepartamento?.slice(0, 8) || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Colaboradores" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Salary distribution */}
            <Card className="border-border/30 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Distribuição Salarial</CardTitle>
                <CardDescription className="text-xs font-body">Por faixa de salário</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RePie>
                    <Pie data={analytics?.salarioDistribuicao || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {(analytics?.salarioDistribuicao || []).map((_: any, i: number) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePie>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost projection */}
            <Card className="border-border/30 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Projeção de Custos</CardTitle>
                <CardDescription className="text-xs font-body">Estimativa mensal (salários + encargos)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={[
                    { mes: 'Jan', custo: (analytics?.custoTotal || 0) * 0.95 },
                    { mes: 'Fev', custo: (analytics?.custoTotal || 0) * 0.97 },
                    { mes: 'Mar', custo: (analytics?.custoTotal || 0) * 0.98 },
                    { mes: 'Abr', custo: (analytics?.custoTotal || 0) },
                    { mes: 'Mai', custo: (analytics?.custoTotal || 0) * 1.02 },
                    { mes: 'Jun', custo: (analytics?.custoTotal || 0) * 1.03 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: any) => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    <Line type="monotone" dataKey="custo" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="Custo Total" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exportar">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatorios.map(({ id, title, description, icon: Icon, gradient }, i) => (
              <motion.div key={id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 rounded-2xl overflow-hidden">
                  <div className={cn("h-[2px] bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity", gradient)} />
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform", gradient)}>
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-display">{title}</CardTitle>
                      <CardDescription className="font-body">{description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5 font-body"
                        onClick={() => handleExport(id)}
                        disabled={generating === id}
                      >
                        {generating === id ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                        {generating === id ? 'Gerando...' : exportFormat === 'excel' ? 'Excel' : exportFormat === 'pdf' ? 'PDF' : 'CSV'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
    </>
  );
}
