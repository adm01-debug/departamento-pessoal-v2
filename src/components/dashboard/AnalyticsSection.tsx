import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  TrendingUp, Activity, Timer, PieChart,
  AlertCircle, UserPlus, UserMinus, Briefcase,
  CheckCircle2, AlertTriangle, Calendar, ChevronRight,
  TrendingDown, Minus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedNumber } from './AnimatedNumber';
import { BarChartWidget } from './BarChartWidget';
import { DonutChart } from './DonutChart';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton } from '@/components/ui/module-skeleton';
import { viewsService } from '@/services/tabelasComplementaresService';
import { useQuery } from '@tanstack/react-query';

const MotionCard = motion.create(Card);

const donutColors = [
  'hsl(var(--primary))',
  'hsl(var(--info))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--xp))',
  'hsl(var(--streak))',
];

/* ─── Indicator with animated bar ─── */
function IndicatorRow({ label, value, maxValue = 10, suffix = "%" }: {
  label: string; value: number; maxValue?: number; suffix?: string;
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const getColor = () => {
    if (value >= maxValue * 0.8) return "from-destructive to-destructive/70";
    if (value >= maxValue * 0.5) return "from-primary-glow to-primary";
    return "from-primary to-primary-glow";
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-body font-body font-medium">{label}</span>
        <span className="text-body font-display font-bold">{value.toFixed(1)}{suffix}</span>
      </div>
      <div className="h-2.5 bg-muted/80 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.3 }}
          className={cn("h-full rounded-full bg-gradient-to-r shadow-sm", getColor())}
        />
      </div>
    </div>
  );
}

/* ─── Quick Stat ─── */
function QuickStat({ label, value, icon: Icon, gradient, index = 0 }: {
  label: string; value: number; icon: React.ElementType; gradient: string; index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3.5 p-3.5 rounded-xl glass hover:border-border/60 transition-all group"
    >
      <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform", gradient)}>
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <div>
        <p className="text-h2 font-display font-bold">
          <AnimatedNumber value={value} />
        </p>
        <p className="text-caption text-muted-foreground font-body">{label}</p>
      </div>
    </motion.div>
  );
}

/* ─── Pendencia Item ─── */
interface Pendencia {
  tipo: string;
  descricao: string;
  quantidade: number;
  icone: 'ferias' | 'afastamentos' | 'admissoes';
}

function PendenciaItem({ pendencia, index }: { pendencia: Pendencia; index: number }) {
  const iconMap: Record<string, React.ElementType> = {
    ferias: Calendar, afastamentos: AlertTriangle, admissoes: UserPlus,
  };
  const gradientMap: Record<string, string> = {
    ferias: "from-primary/80 to-primary",
    afastamentos: "from-primary/60 to-primary/90",
    admissoes: "from-primary to-primary-glow",
  };
  const Icon = iconMap[pendencia.icone] || AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3 p-3 rounded-xl glass hover:border-primary/20 transition-all cursor-pointer group"
    >
      <div className={cn("p-2.5 rounded-xl bg-gradient-to-br", gradientMap[pendencia.icone])}>
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body font-body font-medium truncate">{pendencia.descricao}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-caption font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{pendencia.quantidade}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </div>
    </motion.div>
  );
}

/* ─── Alertas RH Widget ─── */
function AlertasRHWidget() {
  const navigate = useNavigate();
  const { data: alertas = [], isLoading } = useQuery({
    queryKey: ['vw-alertas-rh'],
    queryFn: () => viewsService.alertasRH(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <CardSkeleton className="h-32 border-0 p-0" />;
  if (!alertas.length) return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="p-3 rounded-2xl bg-muted/50 mb-3"><Activity className="h-6 w-6 text-muted-foreground" /></div>
      <p className="text-caption text-muted-foreground font-body">Nenhum alerta de RH</p>
    </div>
  );

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
      {alertas.slice(0, 8).map((a: any, i: number) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => navigate('/relatorios')}
          className="flex items-center gap-3 p-2.5 rounded-xl glass text-sm hover:border-primary/20 cursor-pointer group transition-all"
        >
          <div className={cn(
            "p-1.5 rounded-lg shrink-0",
            a.prioridade === 'alta' ? "bg-destructive/10 text-destructive" : 
            a.prioridade === 'media' ? "bg-warning/10 text-warning" : "bg-info/10 text-info"
          )}>
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <span className="flex-1 truncate text-body font-body text-xs font-medium">{a.descricao || a.tipo || 'Alerta de sistema'}</span>
          <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tight opacity-70">
            {a.prioridade || 'Normal'}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Cadastro Incompleto Widget ─── */
function CadastroIncompletoWidget() {
  const navigate = useNavigate();
  const { data: incompletos = [], isLoading } = useQuery({
    queryKey: ['vw-cadastro-incompleto'],
    queryFn: () => viewsService.cadastroIncompleto(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <CardSkeleton className="h-32 border-0 p-0" />;
  if (!incompletos.length) return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="p-3 rounded-2xl bg-gradient-to-br from-success/20 to-finance/10 mb-3"><CheckCircle2 className="h-6 w-6 text-success" /></div>
      <p className="text-caption text-muted-foreground font-body">Todos os cadastros estão completos</p>
    </div>
  );

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
      {incompletos.slice(0, 8).map((c: any, i: number) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => navigate(`/colaboradores/${c.id}/editar`)}
          className="flex items-center gap-3 p-2.5 rounded-xl glass text-sm hover:border-destructive/20 cursor-pointer group transition-all"
        >
          <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive shrink-0 group-hover:bg-destructive group-hover:text-white transition-colors">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold font-display">{c.nome_completo || 'Colaborador'}</p>
            <p className="text-[10px] text-muted-foreground truncate">{c.campos_faltantes || 'Dados pendentes'}</p>
          </div>
          <ChevronRight className="h-3 w-3 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Exports ─── */
interface AnalyticsSectionProps {
  stats: {
    headcount: number;
    admissoesMes: number;
    demissoesMes: number;
    turnover: number;
    absenteismo: number;
    departamentos: { nome: string; count: number }[];
  } | undefined;
  pendencias: Pendencia[] | undefined;
  isLoadingStats: boolean;
  isLoadingPendencias: boolean;
  isEmptySystem: boolean;
}

export function AnalyticsSection({ stats, pendencias, isLoadingStats, isLoadingPendencias, isEmptySystem }: AnalyticsSectionProps) {
  const navigate = useNavigate();
  return (
    <>
      {/* Row 1: 3-col analytics */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <MotionCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden group hover:border-primary/20 transition-all">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              Evolução Headcount
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => navigate('/relatorios')} className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
               <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isEmptySystem ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 rounded-2xl bg-muted/50 mb-3"><TrendingUp className="h-6 w-6 text-muted-foreground" /></div>
                <p className="text-caption text-muted-foreground font-body">Cadastre colaboradores para visualizar</p>
              </div>
            ) : (
              <BarChartWidget 
                data={[
                  { label: 'Headcount', value: stats?.headcount || 0, color: 'bg-gradient-to-t from-primary to-primary-glow' },
                  { label: 'Novos', value: stats?.admissoesMes || 0, color: 'bg-gradient-to-t from-success to-success/70' }
                ]} 
                height={140} 
              />
            )}
          </CardContent>
        </MotionCard>

        <MotionCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden group hover:border-warning/20 transition-all">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-warning to-warning/70">
                <Activity className="h-4 w-4 text-white" />
              </div>
              Alertas de RH
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => navigate('/relatorios')} className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
               <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent><AlertasRHWidget /></CardContent>
        </MotionCard>

        <MotionCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden group hover:border-destructive/20 transition-all">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-destructive to-destructive/70">
                <Timer className="h-4 w-4 text-white" />
              </div>
              Integridade Cadastral
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => navigate('/colaboradores')} className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
               <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent><CadastroIncompletoWidget /></CardContent>
        </MotionCard>
      </div>

      {/* Row 2: 4-col details */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Movimentação */}
        <MotionCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-glow to-primary">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              Movimentação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingStats ? (
              <div className="space-y-3">{Array(3).fill(0).map((_, i) => <CardSkeleton key={i} className="h-16" />)}</div>
            ) : (
              <>
                <QuickStat label="Admissões" value={stats?.admissoesMes || 0} icon={UserPlus} gradient="from-primary to-primary-glow" index={0} />
                <QuickStat label="Desligamentos" value={stats?.demissoesMes || 0} icon={UserMinus} gradient="from-destructive to-destructive/70" index={1} />
                <QuickStat label="Headcount" value={stats?.headcount || 0} icon={Briefcase} gradient="from-primary/80 to-primary" index={2} />
              </>
            )}
          </CardContent>
        </MotionCard>

        {/* Departamentos */}
        <MotionCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <PieChart className="h-4 w-4 text-primary-foreground" />
              </div>
              Departamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? <CardSkeleton className="h-48 border-0 p-0" /> :
              stats?.departamentos && stats.departamentos.length > 0 ? (
                <DonutChart
                  segments={stats.departamentos.map((d, i) => ({ label: d.nome, value: d.count, color: donutColors[i % donutColors.length] }))}
                  size={130} strokeWidth={14} className="flex flex-col items-center"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="p-4 rounded-2xl bg-muted/50 mb-3"><PieChart className="h-8 w-8 text-muted-foreground" /></div>
                  <p className="text-caption text-muted-foreground font-body">Nenhum departamento cadastrado</p>
                </div>
              )}
          </CardContent>
        </MotionCard>

        {/* Indicadores */}
        <MotionCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/80 to-primary">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              Indicadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-6">{Array(3).fill(0).map((_, i) => <CardSkeleton key={i} className="h-14 border-0 p-0" />)}</div>
            ) : (
              <div className="space-y-5">
                <IndicatorRow label="Turnover" value={stats?.turnover || 0} maxValue={20} />
                <IndicatorRow label="Absenteísmo" value={stats?.absenteismo || 0} maxValue={10} />
                <IndicatorRow label="Headcount" value={stats?.headcount || 0} maxValue={Math.max((stats?.headcount || 0) * 1.2, 10)} suffix="" />
              </div>
            )}
          </CardContent>
        </MotionCard>

        {/* Pendências */}
        <MotionCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-h3 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/60 to-primary/90">
                <AlertCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              Pendências
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPendencias ? (
              <div className="space-y-3">{Array(2).fill(0).map((_, i) => <CardSkeleton key={i} className="h-14 border-0 p-0" />)}</div>
            ) : pendencias && pendencias.length > 0 ? (
              <div className="space-y-2">
                {pendencias.map((p, i) => <PendenciaItem key={i} pendencia={p} index={i} />)}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-success/20 to-finance/10 mb-3">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <p className="font-display font-semibold">Tudo em dia!</p>
                <p className="text-caption text-muted-foreground font-body mt-1">Nenhuma pendência encontrada</p>
              </motion.div>
            )}
          </CardContent>
        </MotionCard>
      </div>
    </>
  );
}
