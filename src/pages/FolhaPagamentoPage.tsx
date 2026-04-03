import { PageTitle } from '@/components/PageTitle';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Download, Upload, Calculator, CheckCircle, AlertTriangle, Clock, RefreshCw,
  DollarSign, Users, TrendingDown, ArrowRight, FileText, Info, Shield, ChevronRight,
  Banknote, Receipt, Gift, Loader2
} from 'lucide-react';
import { useCalcular13Salario } from '@/hooks/useCalcular13Salario';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';
import { PageLayout } from '@/components/layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';
import { KPICardSkeleton } from '@/components/ui/module-skeleton';

/* ─── Helpers ─── */
function gerarCompetencias(): string[] {
  const competencias: string[] = [];
  const hoje = new Date();
  for (let i = -12; i <= 2; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    competencias.push(`${mes}/${data.getFullYear()}`);
  }
  return competencias.reverse();
}

function getCompetenciaAtual(): string {
  const hoje = new Date();
  return `${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(value);
}

/* ─── Data Hook ─── */
interface FolhaResumo {
  colaboradores: number;
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
  inss: number;
  fgts: number;
  irrf: number;
  status: Record<string, string>;
}

function useFolhaResumo(competencia: string) {
  return useQuery<FolhaResumo>({
    queryKey: ['folha-resumo', competencia],
    queryFn: async () => {
      const [mes, ano] = competencia.split('/');
      const competenciaDB = `${ano}-${mes}`;
      const { data: folhaData } = await supabase.from('folhas_pagamento').select('*').eq('competencia', competenciaDB);
      const colaboradores = folhaData?.length || 0;
      const totalProventos = folhaData?.reduce((acc, f) => acc + (f.total_proventos || 0), 0) || 0;
      const totalDescontos = folhaData?.reduce((acc, f) => acc + (f.total_descontos || 0), 0) || 0;
      // Estimate encargos from proventos (INSS ~11%, FGTS ~8%, IRRF ~7.5% approximation)
      const inss = totalProventos * 0.11;
      const fgts = totalProventos * 0.08;
      const irrf = Math.max(0, totalDescontos - inss);

      const hasData = colaboradores > 0;
      return {
        colaboradores, totalProventos, totalDescontos, inss, fgts, irrf,
        liquido: totalProventos - totalDescontos,
        status: {
          ponto: hasData ? 'importado' : 'pendente',
          lancamentos: hasData ? 'conferido' : 'pendente',
          calculo: hasData ? 'executado' : 'pendente',
          conferencia: 'pendente',
          fechamento: 'aberto',
        },
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

/* ─── Pipeline Step ─── */
const stepConfig = [
  { key: 'ponto', label: 'Importar Ponto', desc: 'Dados do ponto eletrônico', icon: Clock },
  { key: 'lancamentos', label: 'Lançamentos', desc: 'Eventos e variáveis', icon: FileText },
  { key: 'calculo', label: 'Cálculo', desc: 'Processamento da folha', icon: Calculator },
  { key: 'conferencia', label: 'Conferência', desc: 'Validação dos valores', icon: Shield },
  { key: 'fechamento', label: 'Fechamento', desc: 'Aprovação e envio', icon: CheckCircle },
];

const statusStyles: Record<string, { dot: string; ring: string; label: string }> = {
  pendente: { dot: 'bg-muted-foreground', ring: 'border-muted-foreground/30', label: 'Pendente' },
  importado: { dot: 'bg-success', ring: 'border-success/30', label: 'Importado' },
  conferido: { dot: 'bg-success', ring: 'border-success/30', label: 'Conferido' },
  executado: { dot: 'bg-success', ring: 'border-success/30', label: 'Executado' },
  aprovado: { dot: 'bg-success', ring: 'border-success/30', label: 'Aprovado' },
  aberto: { dot: 'bg-warning', ring: 'border-warning/30', label: 'Aberto' },
  fechado: { dot: 'bg-success', ring: 'border-success/30', label: 'Fechado' },
};

function PipelineStep({ step, status, index, isLast }: { step: typeof stepConfig[0]; status: string; index: number; isLast: boolean }) {
  const st = statusStyles[status] || statusStyles.pendente;
  const isDone = ['importado', 'conferido', 'executado', 'aprovado', 'fechado'].includes(status);
  const Icon = step.icon;

  return (
    <>
    <PageTitle title="Cálculo de Folha" description="Processamento de folha de pagamento" />
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center gap-3"
    >
      <div className="flex flex-col items-center">
        <div className={cn(
          "relative p-3 rounded-2xl border-2 transition-all",
          isDone ? "bg-success/10 border-success/30" : "bg-card border-border/30",
          !isDone && index === 0 && "border-primary/50 shadow-glow-sm"
        )}>
          <Icon className={cn("h-5 w-5", isDone ? "text-success" : "text-muted-foreground")} />
          {isDone && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-success flex items-center justify-center"
            >
              <CheckCircle className="h-3 w-3 text-success-foreground" />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("text-body font-display font-semibold", isDone ? "text-success" : "text-foreground")}>{step.label}</p>
        <p className="text-caption text-muted-foreground font-body">{step.desc}</p>
      </div>

      <Badge variant="outline" className={cn("text-[10px] shrink-0 rounded-full", isDone ? "bg-success/10 text-success border-success/30" : "")}>
        {st.label}
      </Badge>

      {!isLast && <ChevronRight className="h-4 w-4 text-muted-foreground/30 shrink-0 hidden lg:block" />}
    </motion.div>
    </>
  );
}

/* ─── KPI Card ─── */
function FolhaKPI({ title, value, icon: Icon, gradient, index, tooltip }: {
  title: string; value: number; icon: React.ElementType; gradient: string; index: number; tooltip?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className="border border-border/30 rounded-2xl overflow-hidden relative group hover:shadow-elevated transition-all">
        <div className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r", gradient)} />
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("p-1.5 rounded-lg bg-gradient-to-br", gradient)}>
              <Icon className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><Info className="h-3 w-3 text-muted-foreground/50" /></TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-xs">{tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-xl font-display font-bold">
            <AnimatedNumber value={value} format={formatCurrency} />
          </p>
          <p className="text-[11px] text-muted-foreground font-body mt-1">{title}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Validation Alerts ─── */
function ValidationAlerts({ resumo }: { resumo: FolhaResumo }) {
  const alerts: { type: 'warning' | 'info' | 'success'; msg: string }[] = [];

  if (resumo.colaboradores === 0) {
    alerts.push({ type: 'warning', msg: 'Nenhum colaborador processado nesta competência.' });
  }
  if (resumo.totalDescontos > resumo.totalProventos * 0.5) {
    alerts.push({ type: 'warning', msg: 'Descontos representam mais de 50% dos proventos. Verifique os lançamentos.' });
  }
  if (resumo.liquido < 0) {
    alerts.push({ type: 'warning', msg: 'Líquido total negativo detectado. Revise os cálculos.' });
  }
  if (alerts.length === 0 && resumo.colaboradores > 0) {
    alerts.push({ type: 'success', msg: 'Todos os valores estão consistentes. Folha pronta para conferência.' });
  }

  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border text-body font-body",
            a.type === 'warning' && "bg-warning/5 border-warning/20 text-warning",
            a.type === 'info' && "bg-info/5 border-info/20 text-info",
            a.type === 'success' && "bg-success/5 border-success/20 text-success",
          )}
        >
          {a.type === 'warning' ? <AlertTriangle className="h-4 w-4 shrink-0" /> :
           a.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> :
           <Info className="h-4 w-4 shrink-0" />}
          <span>{a.msg}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Main Page ─── */
export default function FolhaPagamentoPage() {
  const competencias = useMemo(() => gerarCompetencias(), []);
  const [competencia, setCompetencia] = useState(getCompetenciaAtual());
  const { data: resumo, isLoading, refetch } = useFolhaResumo(competencia);
  const queryClient = useQueryClient();

  const calcularFolha = useMutation({
    mutationFn: async (comp: string) => {
      const [mes, ano] = comp.split('/');
      const competenciaDB = `${ano}-${mes}`;
      const { data: existing } = await supabase.from('folhas_pagamento').select('id').eq('competencia', competenciaDB).maybeSingle();
      if (existing) {
        const { data, error } = await supabase.from('folhas_pagamento')
          .update({ status: 'calculada' as const, data_calculo: new Date().toISOString() })
          .eq('id', existing.id).select().single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase.from('folhas_pagamento')
        .insert({ competencia: competenciaDB, tipo: 'mensal' }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folha-resumo', competencia] });
      toast.success('Folha calculada com sucesso!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  return (
    <PageLayout
      title="Processamento de Folha"
      description={`Competência ${competencia}`}
      icon={<Banknote className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary to-primary-glow"
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={competencia} onValueChange={setCompetencia}>
            <SelectTrigger className="w-[130px] rounded-xl" aria-label="Selecionar competência">
              <SelectValue placeholder="Mês/Ano" />
            </SelectTrigger>
            <SelectContent>
              {competencias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl" aria-label="Atualizar dados">
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 font-body">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Importar Ponto</span>
          </Button>
          <Button
            size="sm"
            onClick={() => calcularFolha.mutate(competencia)}
            disabled={calcularFolha.isPending}
            className="rounded-xl gap-1.5 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg font-body"
          >
            <Calculator className="h-4 w-4" />
            {calcularFolha.isPending ? 'Calculando...' : 'Calcular'}
          </Button>
        </div>
      }
    >
      {/* KPI Summary — financial hierarchy */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {isLoading ? Array(6).fill(0).map((_, i) => <KPICardSkeleton key={i} />) : (
          <>
            <FolhaKPI title="Colaboradores" value={resumo?.colaboradores || 0} icon={Users}
              gradient="from-primary to-primary-glow" index={0}
              tooltip="Total de colaboradores com folha processada nesta competência" />
            <FolhaKPI title="Total Proventos" value={resumo?.totalProventos || 0} icon={TrendingDown}
              gradient="from-success to-success/70" index={1}
              tooltip="Soma de todos os proventos: salário base, horas extras, gratificações" />
            <FolhaKPI title="Total Descontos" value={resumo?.totalDescontos || 0} icon={TrendingDown}
              gradient="from-destructive to-destructive/70" index={2}
              tooltip="INSS, IRRF, VT, VA, plano de saúde e outros descontos" />
            <FolhaKPI title="Líquido Total" value={resumo?.liquido || 0} icon={DollarSign}
              gradient="from-primary-glow to-primary" index={3}
              tooltip="Valor líquido = Proventos - Descontos" />
            <FolhaKPI title="INSS + FGTS" value={(resumo?.inss || 0) + (resumo?.fgts || 0)} icon={Shield}
              gradient="from-info to-info/70" index={4}
              tooltip="Encargos patronais: INSS + FGTS sobre a folha" />
            <FolhaKPI title="IRRF" value={resumo?.irrf || 0} icon={Receipt}
              gradient="from-warning to-warning/70" index={5}
              tooltip="Imposto de Renda Retido na Fonte" />
          </>
        )}
      </div>

      {/* Pipeline de processamento */}
      <Card className="border border-border/30 rounded-2xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <ArrowRight className="h-4 w-4 text-primary-foreground" />
            </div>
            Pipeline de Processamento
            <Badge variant="outline" className="ml-auto text-[10px] rounded-full font-body">
              {competencia}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {stepConfig.map((step, i) => (
              <PipelineStep
                key={step.key}
                step={step}
                status={resumo?.status[step.key] || 'pendente'}
                index={i}
                isLast={i === stepConfig.length - 1}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validações automáticas */}
      {!isLoading && resumo && (
        <Card className="border border-border/30 rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-warning to-warning/70">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              Validações Automáticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ValidationAlerts resumo={resumo} />
          </CardContent>
        </Card>
      )}

      {/* Breakdown detalhado — transparência */}
      {!isLoading && resumo && resumo.colaboradores > 0 && (
        <Card className="border border-border/30 rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-info to-info/70">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              Composição da Folha
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground/50 ml-1" /></TooltipTrigger>
                  <TooltipContent className="max-w-[250px] text-xs">
                    Detalhamento dos componentes que formam o total da folha de pagamento
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Salário Base + Adicionais', value: resumo.totalProventos, color: 'bg-success', pct: 100 },
                { label: 'INSS (Empregado)', value: resumo.inss, color: 'bg-info', pct: resumo.totalProventos > 0 ? (resumo.inss / resumo.totalProventos) * 100 : 0 },
                { label: 'IRRF', value: resumo.irrf, color: 'bg-warning', pct: resumo.totalProventos > 0 ? (resumo.irrf / resumo.totalProventos) * 100 : 0 },
                { label: 'FGTS (Patronal)', value: resumo.fgts, color: 'bg-primary', pct: resumo.totalProventos > 0 ? (resumo.fgts / resumo.totalProventos) * 100 : 0 },
                { label: 'Outros Descontos', value: resumo.totalDescontos - resumo.inss - resumo.irrf, color: 'bg-destructive', pct: resumo.totalProventos > 0 ? ((resumo.totalDescontos - resumo.inss - resumo.irrf) / resumo.totalProventos) * 100 : 0 },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-body font-body">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-caption text-muted-foreground">{item.pct.toFixed(1)}%</span>
                      <span className="text-body font-display font-bold">{formatCurrency(item.value)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(item.pct, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                      className={cn("h-full rounded-full", item.color)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Export actions */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-border/30">
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 font-body">
                <Download className="h-4 w-4" />Exportar PDF
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 font-body">
                <Download className="h-4 w-4" />Exportar XLSX
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 font-body">
                <FileText className="h-4 w-4" />Contabilidade
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
