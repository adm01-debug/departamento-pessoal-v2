import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, DollarSign, Calendar, TrendingUp, Cake, BarChart3, Download, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const relatorios = [
  { id: 'folha', title: 'Folha de Pagamento', description: 'Relatório detalhado da folha por competência', icon: DollarSign, gradient: 'from-success to-success/70' },
  { id: 'colaboradores', title: 'Resumo Colaboradores', description: 'Resumo geral dos colaboradores ativos', icon: Users, gradient: 'from-info to-info/70' },
  { id: 'ferias', title: 'Férias Vencidas', description: 'Colaboradores com férias vencendo', icon: Calendar, gradient: 'from-warning to-warning/70' },
  { id: 'aniversariantes', title: 'Aniversariantes', description: 'Aniversariantes do mês', icon: Cake, gradient: 'from-destructive to-destructive/70' },
  { id: 'turnover', title: 'Turnover', description: 'Análise de rotatividade', icon: TrendingUp, gradient: 'from-primary to-primary/70' },
  { id: 'encargos', title: 'Encargos Sociais', description: 'Resumo de encargos (INSS, FGTS)', icon: FileText, gradient: 'from-info to-primary' },
];

async function generateReport(id: string) {
  switch (id) {
    case 'colaboradores': {
      const { data, error } = await supabase.from('colaboradores').select('nome_completo, cpf, cargo, departamento, status, data_admissao, salario_base').eq('status', 'ativo').order('nome_completo');
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

function downloadCSV(title: string, rows: any[], columns: string[]) {
  if (!rows.length) { toast.info('Sem dados para exportar'); return; }
  const header = columns.join(';');
  const lines = rows.map(r => columns.map(c => r[c] ?? '').join(';'));
  const csv = [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s/g, '_')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Relatório exportado!');
}

export default function RelatoriosPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = async (id: string) => {
    setGenerating(id);
    try {
      const report = await generateReport(id);
      downloadCSV(report.title, report.rows, report.columns);
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <PageLayout
      title="Relatórios"
      description="Relatórios gerenciais e operacionais"
      icon={<BarChart3 className="h-5 w-5 text-primary-foreground" />}
      gradient="from-info to-primary"
    >
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5 font-body"
                  onClick={() => handleGenerate(id)}
                  disabled={generating === id}
                >
                  {generating === id ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  {generating === id ? 'Gerando...' : 'Gerar Relatório'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
}
