import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  TrendingUp, Activity, Timer, PieChart,
  AlertCircle, UserPlus, UserMinus, Briefcase,
  CheckCircle2, AlertTriangle, Calendar, ChevronRight,
  TrendingDown, Minus, ShieldCheck, Clock, Search, Filter, X,
  Check, Eye, Forward, MoreHorizontal, History, XCircle, ChevronLeft, MapPin, Shield,
  Download, ListChecks, CheckCircle, AlertOctagon, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedNumber } from './AnimatedNumber';
import { BarChartWidget } from './BarChartWidget';
import { DonutChart } from './DonutChart';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton } from '@/components/ui/module-skeleton';
import { viewsService } from '@/services/tabelasComplementaresService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { usePendencias, type Pendencia as DB_Pendencia } from '@/hooks/usePendencias';
import { usePontoMelhorado, type SolicitacaoAjuste } from '@/hooks/usePontoMelhorado';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { exportPortaria671PDF } from '@/services/exportService';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

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
interface PendenciaSummary {
  tipo: string;
  descricao: string;
  quantidade: number;
  icone: 'ferias' | 'afastamentos' | 'admissoes' | 'assinaturas' | 'ponto' | 'documentos';
}

function PendenciaItem({ pendencia, index, onClick }: { pendencia: PendenciaSummary; index: number; onClick?: () => void }) {
  const iconMap: Record<string, React.ElementType> = {
    ferias: Calendar, 
    afastamentos: AlertTriangle, 
    admissoes: UserPlus,
    assinaturas: ShieldCheck,
    ponto: Clock,
    documentos: Briefcase
  };
  const gradientMap: Record<string, string> = {
    ferias: "from-primary/80 to-primary",
    afastamentos: "from-primary/60 to-primary/90",
    admissoes: "from-primary to-primary-glow",
    assinaturas: "from-success/70 to-success",
    ponto: "from-warning/70 to-warning",
    documentos: "from-info/70 to-info",
  };
  const Icon = iconMap[pendencia.icone] || AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
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
  pendencias: PendenciaSummary[] | undefined;
  isLoadingStats: boolean;
  isLoadingPendencias: boolean;
  isEmptySystem: boolean;
  empresaId?: string;
}

export function AnalyticsSection({ stats, pendencias, isLoadingStats, isLoadingPendencias, isEmptySystem, empresaId }: AnalyticsSectionProps) {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const { data: dbPendencias, isLoading: isLoadingDB, updateStatus } = usePendencias(empresaId);
  const { solicitacoes: pontoSolicitacoes, isLoading: isLoadingPonto, responderSolicitacao } = usePontoMelhorado(empresaId);

  // Real-time notifications for Ponto
  useMemo(() => {
    if (!empresaId) return;
    const channel = (supabase as any)
      .channel('ponto-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'solicitacoes_ajuste_ponto', filter: `empresa_id=eq.${empresaId}` },
        (payload: any) => {
          if (payload.eventType === 'UPDATE') {
            const status = payload.new.status;
            if (status === 'aprovado' || status === 'recusado') {
              toast.info(`Solicitação de Ponto ${status === 'aprovado' ? 'aprovada' : 'recusada'}.`, {
                description: `Ajuste para ${payload.new.data_ponto} processado.`,
                icon: status === 'aprovado' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />
              });
            }
          }
        }
      )
      .subscribe();
    return () => { (supabase as any).removeChannel(channel); };
  }, [empresaId]);

  const filteredPendencias = useMemo(() => {
    const list: any[] = [];
    
    // Add DB Pendencias
    if (dbPendencias) {
      dbPendencias.forEach(p => list.push({ ...p, source: 'db' }));
    }
    
    // Add Ponto Solicitation as Pendencias
    if (pontoSolicitacoes) {
      pontoSolicitacoes.filter((s: any) => s.status === 'enviado').forEach((s: any) => {
        list.push({
          id: s.id,
          tipo: 'ponto',
          titulo: `Ajuste de Ponto: ${s.colaborador?.nome_completo || 'Colaborador'}`,
          descricao: `Sugerido: ${s.hora_sugerida} - Motivo: ${s.motivo}`,
          prioridade: 'media',
          status: 'pendente',
          criado_at: s.created_at,
          source: 'ponto',
          raw: s
        });
      });
    }

    return list.filter(p => {
      const matchesSearch = p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.descricao.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || p.tipo === filterType;
      return matchesSearch && matchesType;
    });
  }, [dbPendencias, pontoSolicitacoes, searchQuery, filterType]);

  const paginatedPendencias = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredPendencias.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPendencias, page]);

  const totalPages = Math.ceil(filteredPendencias.length / itemsPerPage);

  const handleOpenDetail = (type?: string) => {
    if (type) setFilterType(type);
    setPage(1);
    setIsDetailOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'media': return 'text-warning bg-warning/10 border-warning/20';
      case 'baixa': return 'text-info bg-info/10 border-info/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };
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
                {pendencias.map((p, i) => (
                  <PendenciaItem 
                    key={i} 
                    pendencia={p} 
                    index={i} 
                    onClick={() => handleOpenDetail(p.tipo)}
                  />
                ))}
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

      {/* Modal de Detalhes de Pendências */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl border-border/40 shadow-2xl glass">
          <DialogHeader className="p-6 pb-4 border-b border-border/10 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Lista de Pendências
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Visualize e tome ações rápidas sobre os itens pendentes do sistema.
                </DialogDescription>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Buscar por título ou descrição..."
                  className="pl-10 h-11 rounded-xl bg-muted/40 border-border/20 focus:bg-background transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {(['all', 'ferias', 'assinaturas', 'ponto', 'documentos'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      "rounded-lg h-11 px-4 font-medium transition-all text-xs",
                      filterType === type ? "shadow-lg shadow-primary/20" : "bg-muted/20 border-border/10"
                    )}
                    onClick={() => setFilterType(type)}
                  >
                    {type === 'all' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-muted/5">
            {isLoadingDB || isLoadingPonto ? (
              <div className="space-y-4">
                {Array(4).fill(0).map((_, i) => <CardSkeleton key={i} className="h-24 rounded-2xl" />)}
              </div>
            ) : paginatedPendencias.length > 0 ? (
              <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                  {paginatedPendencias.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="group p-5 rounded-2xl glass border border-border/30 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                      
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className={cn(
                              "p-3 rounded-2xl bg-gradient-to-br shrink-0 shadow-lg",
                              item.tipo === 'ferias' ? "from-primary/80 to-primary" :
                              item.tipo === 'ponto' ? "from-warning/80 to-warning" :
                              item.tipo === 'assinaturas' ? "from-success/80 to-success" : "from-info/80 to-info"
                            )}>
                              {item.tipo === 'ferias' ? <Calendar className="h-5 w-5 text-white" /> :
                               item.tipo === 'ponto' ? <Clock className="h-5 w-5 text-white" /> :
                               item.tipo === 'assinaturas' ? <ShieldCheck className="h-5 w-5 text-white" /> : <Briefcase className="h-5 w-5 text-white" />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-display font-bold text-lg leading-tight">{item.titulo}</h4>
                                <Badge className={cn("text-[10px] font-bold uppercase tracking-wider py-0.5", getPriorityColor(item.prioridade))}>
                                  {item.prioridade}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] opacity-70">
                                  {format(new Date(item.criado_at), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                {item.descricao}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                              onClick={() => window.open(`/detalhes/${item.referencia_id || item.id}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 border-border/40 shadow-xl glass">
                                <DropdownMenuItem 
                                  className="rounded-lg gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary" 
                                  onClick={() => {
                                    if (item.source === 'ponto') {
                                      responderSolicitacao.mutate({ id: item.id, status: 'aprovado' });
                                    } else {
                                      updateStatus.mutate({ id: item.id, status: 'concluido' });
                                    }
                                  }}
                                >
                                  <Check className="h-4 w-4" /> Aprovar / Concluir
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="rounded-lg gap-2 cursor-pointer focus:bg-warning/10 focus:text-warning" 
                                  onClick={() => {
                                    if (item.source === 'ponto') {
                                      responderSolicitacao.mutate({ id: item.id, status: 'recusado', observacoes: 'Necessita revisão.' });
                                    } else {
                                      updateStatus.mutate({ id: item.id, status: 'em_analise' });
                                    }
                                  }}
                                >
                                  <Activity className="h-4 w-4" /> {item.source === 'ponto' ? 'Recusar' : 'Marcar Revisão'}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer">
                                  <Forward className="h-4 w-4" /> Encaminhar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Compliance & History Highlight for Ponto */}
                        {item.source === 'ponto' && item.raw && (
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-muted/30 border border-border/10 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary opacity-70" />
                              <div className="text-[10px]">
                                <p className="text-muted-foreground font-bold uppercase">Timezone</p>
                                <p className="font-medium">{item.raw.relatorio_conformidade?.timezone || 'America/Sao_Paulo'}</p>
                              </div>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30 border border-border/10 flex items-center gap-2">
                              <History className="h-4 w-4 text-warning opacity-70" />
                              <div className="text-[10px]">
                                <p className="text-muted-foreground font-bold uppercase">Original</p>
                                <p className="font-medium">{item.raw.hora_original?.substring(0, 5) || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30 border border-border/10 flex items-center gap-2">
                              <Shield className="h-4 w-4 text-success opacity-70" />
                              <div className="text-[10px]">
                                <p className="text-muted-foreground font-bold uppercase">Conformidade 671</p>
                                <p className="font-medium">Validado</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 p-4 bg-muted/20 rounded-2xl border border-border/10">
                    <p className="text-xs text-muted-foreground">
                      Mostrando {Math.min(filteredPendencias.length, (page - 1) * itemsPerPage + 1)}-{Math.min(filteredPendencias.length, page * itemsPerPage)} de {filteredPendencias.length}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="h-9 w-9 p-0 rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1 px-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all",
                              page === i + 1 ? "bg-primary w-4" : "bg-primary/20 hover:bg-primary/40"
                            )}
                          />
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="h-9 w-9 p-0 rounded-lg"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-6 rounded-3xl bg-muted/20 mb-4 border border-border/10">
                  <X className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-display font-bold">Nenhuma pendência</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                  Não encontramos itens que correspondam à sua busca ou filtro.
                </p>
                <Button variant="outline" className="mt-6 rounded-xl px-8" onClick={() => { setSearchQuery(""); setFilterType("all"); }}>
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 border-t border-border/10 bg-muted/5">
            <Button variant="outline" className="rounded-xl px-8" onClick={() => setIsDetailOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
