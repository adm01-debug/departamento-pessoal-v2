import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FeriasStats {
  total: number;
  pendentes: number;
  aprovadas: number;
  emGozo: number;
  abonoPecuniario: number;
  vencidas: number;
}

const kpiConfig = [
  { key: 'total', label: 'Total', icon: Calendar, color: 'text-primary', bgColor: 'bg-primary/10', tooltip: 'Total de solicitações de férias no período' },
  { key: 'pendentes', label: 'Pendentes', icon: Clock, color: 'text-warning', bgColor: 'bg-warning/10', tooltip: 'Aguardando aprovação no workflow' },
  { key: 'aprovadas', label: 'Aprovadas', icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10', tooltip: 'Aprovadas pelo RH ou gestor' },
  { key: 'emGozo', label: 'Em Gozo', icon: TrendingUp, color: 'text-info', bgColor: 'bg-info/10', tooltip: 'Colaboradores atualmente em férias' },
  { key: 'abonoPecuniario', label: 'Abono Pecuniário', icon: DollarSign, color: 'text-accent-foreground', bgColor: 'bg-accent/50', tooltip: 'Solicitações com venda de até 1/3 das férias' },
  { key: 'vencidas', label: 'Vencidas', icon: AlertTriangle, color: 'text-destructive', bgColor: 'bg-destructive/10', tooltip: 'Períodos concessivos vencidos — ação urgente' },
] as const;

export function FeriasKPIs({ stats }: { stats: FeriasStats }) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpiConfig.map(({ key, label, icon: Icon, color, bgColor, tooltip }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="border border-border/30 shadow-elevated rounded-2xl hover:shadow-lg transition-shadow cursor-default">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${bgColor}`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-display font-bold leading-none">{stats[key as keyof FeriasStats]}</p>
                      <p className="text-[11px] text-muted-foreground font-body truncate mt-0.5">{label}</p>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p className="text-xs max-w-[200px]">{tooltip}</p></TooltipContent>
            </Tooltip>
          </motion.div>
        ))}
      </div>
    </TooltipProvider>
  );
}
