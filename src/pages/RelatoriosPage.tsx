import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, DollarSign, Calendar, TrendingUp, Cake, BarChart3, FileText, Loader2, Mail, Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresa } from '@/contexts';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';
import { useExcelExport } from '@/hooks/useExcelExport';
import { usePDFExport } from '@/hooks/usePDFExport';
import { RelatoriosAnalyticsTab } from '@/components/relatorios/RelatoriosAnalyticsTab';
import { RelatoriosExportTab } from '@/components/relatorios/RelatoriosExportTab';

const relatorios = [
  { id: 'colaboradores', title: 'Resumo Colaboradores', description: 'Colaboradores ativos com dados completos', icon: Users, gradient: 'from-info to-info/70' },
  { id: 'folha', title: 'Folha de Pagamento', description: 'Relatório detalhado da folha', icon: DollarSign, gradient: 'from-success to-success/70' },
  { id: 'ferias', title: 'Férias', description: 'Colaboradores com férias próximas ou vencidas', icon: Calendar, gradient: 'from-warning to-warning/70' },
  { id: 'aniversariantes', title: 'Aniversariantes', description: 'Aniversariantes do mês', icon: Cake, gradient: 'from-destructive to-destructive/70' },
  { id: 'turnover', title: 'Turnover', description: 'Análise de rotatividade', icon: TrendingUp, gradient: 'from-primary to-primary/70' },
  { id: 'encargos', title: 'Encargos Sociais', description: 'Resumo INSS, FGTS, IRRF', icon: FileText, gradient: 'from-info to-primary' },
];

async function fetchReportData(id: string) {
  switch (id) {
    case 'colaboradores': { const { data, error } = await supabase.from('colaboradores').select('nome_completo, cpf, cargo, departamento, status, data_admissao, salario_base').eq('status', 'ativo').order('nome_completo'); if (error) throw error; return { title: 'Colaboradores Ativos', rows: data || [], columns: ['nome_completo', 'cpf', 'cargo', 'departamento', 'salario_base'] }; }
    case 'folha': { const comp = new Date().toISOString().slice(0, 7); const { data, error } = await supabase.from('folhas_pagamento').select('*').eq('competencia', comp); if (error) throw error; return { title: `Folha ${comp}`, rows: data || [], columns: ['colaborador_id', 'competencia', 'total_proventos', 'total_descontos', 'total_liquido', 'status'] }; }
    case 'aniversariantes': { const mes = new Date().getMonth() + 1; const { data, error } = await supabase.from('colaboradores').select('nome_completo, data_nascimento, departamento, cargo').eq('status', 'ativo'); if (error) throw error; return { title: `Aniversariantes - Mês ${mes}`, rows: (data || []).filter(c => c.data_nascimento && new Date(c.data_nascimento).getMonth() + 1 === mes), columns: ['nome_completo', 'data_nascimento', 'departamento', 'cargo'] }; }
    default: return { title: 'Relatório', rows: [], columns: [] };
  }
}

function exportCSV(title: string, rows: any[], columns: string[]) { 
  if (!rows.length) { toast.info('Sem dados'); return; } 
  const blob = new Blob([[columns.join(';'), ...rows.map(r => columns.map(c => r[c] ?? '').join(';'))].join('\n')], { type: 'text/csv;charset=utf-8;' }); 
  const url = URL.createObjectURL(blob); 
  const a = document.createElement('a'); 
  a.href = url; 
  a.download = `${title.replace(/\s/g, '_')}.csv`; 
  a.click(); 
  URL.revokeObjectURL(url); 
  toast.success('CSV exportado!'); 
}

export default function RelatoriosPage() {
  const { empresaAtual } = useEmpresa();
  const [generating, setGenerating] = useState<string | null>(null);
  const { exportarExcel } = useExcelExport();
  const { exportarPDF } = usePDFExport();
  const [exportFormat, setExportFormat] = useState('csv');
  const [emailDialog, setEmailDialog] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const { data: analytics } = useQuery({
    queryKey: ['relatorios_analytics', empresaAtual?.id], enabled: !!empresaAtual?.id,
    queryFn: async () => {
      const [{ data: cols }, { data: deslig }, { data: admissoes }] = await Promise.all([
        supabase.from('colaboradores').select('departamento, status, data_admissao, salario_base').eq('empresa_id', empresaAtual!.id),
        supabase.from('desligamentos').select('data_desligamento, motivo').eq('empresa_id', empresaAtual!.id),
        supabase.from('admissoes').select('data_prevista, departamento').eq('empresa_id', empresaAtual!.id),
      ]);
      const deptMap = new Map<string, number>(); (cols || []).filter(c => c.status === 'ativo').forEach(c => { const d = c.departamento || 'Sem Depto'; deptMap.set(d, (deptMap.get(d) || 0) + 1); });
      const porDepartamento = Array.from(deptMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
      const faixas: Record<string, number> = { 'Até 2k': 0, '2k-4k': 0, '4k-6k': 0, '6k-10k': 0, '10k+': 0 };
      (cols || []).filter(c => c.status === 'ativo' && c.salario_base).forEach(c => { const s = Number(c.salario_base); if (s <= 2000) faixas['Até 2k']++; else if (s <= 4000) faixas['2k-4k']++; else if (s <= 6000) faixas['4k-6k']++; else if (s <= 10000) faixas['6k-10k']++; else faixas['10k+']++; });
      const salarioDistribuicao = Object.entries(faixas).map(([name, value]) => ({ name, value }));
      const months: Record<string, { admissoes: number; desligamentos: number }> = {}; const now = new Date(); for (let i = 5; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); months[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = { admissoes: 0, desligamentos: 0 }; }
      (admissoes || []).forEach(a => { const m = a.data_prevista?.slice(0, 7); if (m && months[m]) months[m].admissoes++; });
      (deslig || []).forEach(d => { const m = d.data_desligamento?.slice(0, 7); if (m && months[m]) months[m].desligamentos++; });
      const tendencia = Object.entries(months).map(([mes, v]) => ({ mes: mes.slice(5), ...v }));
      const custoTotal = (cols || []).filter(c => c.status === 'ativo').reduce((acc, c) => acc + Number(c.salario_base || 0), 0);
      return { porDepartamento, salarioDistribuicao, tendencia, custoTotal, totalAtivos: (cols || []).filter(c => c.status === 'ativo').length, totalDeslig: (deslig || []).length };
    },
  });

  const handleExport = async (id: string) => { 
    setGenerating(id); 
    try { 
      const r = await fetchReportData(id); 
      if (exportFormat === 'excel') {
        exportarExcel(r.title, r.rows, r.columns);
      } else if (exportFormat === 'pdf') {
        exportarPDF(r.title, r.rows, r.columns);
      } else {
        exportCSV(r.title, r.rows, r.columns); 
      }
    } catch (e: any) { 
      toast.error(`Erro: ${e.message}`); 
    } finally { 
      setGenerating(null); 
    } 
  };
  const handleSendEmail = async () => { if (!emailDialog || !emailTo || !empresaAtual?.id) return; setSendingEmail(true); try { await edgeFunctionsService.enviarRelatorioEmail({ tipo: emailDialog, destinatarios: emailTo.split(',').map(e => e.trim()), empresaId: empresaAtual.id }); toast.success('Relatório enviado por email!'); setEmailDialog(null); setEmailTo(''); } catch (e: any) { toast.error(`Erro: ${e.message}`); } finally { setSendingEmail(false); } };

  return (
    <>
      <PageTitle title="Relatórios" description="Relatórios gerenciais" />
      <PageLayout title="Relatórios Analíticos" description="Dashboards, tendências e exportações" icon={<BarChart3 className="h-5 w-5 text-primary-foreground" />} gradient="from-info to-primary">
        <Tabs defaultValue="analytics">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="rounded-xl">
              <TabsTrigger value="analytics" className="rounded-lg font-body">📊 Analytics</TabsTrigger>
              <TabsTrigger value="exportar" className="rounded-lg font-body">📥 Exportar</TabsTrigger>
            </TabsList>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-[130px] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="csv">📄 CSV</SelectItem><SelectItem value="excel">📊 Excel</SelectItem><SelectItem value="pdf">📋 PDF</SelectItem></SelectContent>
            </Select>
          </div>
          <TabsContent value="analytics"><RelatoriosAnalyticsTab analytics={analytics} /></TabsContent>
          <TabsContent value="exportar"><RelatoriosExportTab relatorios={relatorios} exportFormat={exportFormat} generating={generating} onExport={handleExport} onEmailOpen={setEmailDialog} /></TabsContent>
        </Tabs>
        <Dialog open={!!emailDialog} onOpenChange={(o) => { if (!o) setEmailDialog(null); }}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader><DialogTitle className="flex items-center gap-2 font-display"><Mail className="h-5 w-5" /> Enviar Relatório por Email</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label className="font-body">Destinatários (separados por vírgula)</Label><Input placeholder="email@empresa.com" value={emailTo} onChange={e => setEmailTo(e.target.value)} className="rounded-xl" /></div>
              <p className="text-sm text-muted-foreground font-body">Relatório: <span className="font-semibold text-foreground">{relatorios.find(r => r.id === emailDialog)?.title}</span></p>
              <Button onClick={handleSendEmail} disabled={sendingEmail || !emailTo.trim()} className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-glow font-body">
                {sendingEmail ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}{sendingEmail ? 'Enviando...' : 'Enviar por Email'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageLayout>
    </>
  );
}
