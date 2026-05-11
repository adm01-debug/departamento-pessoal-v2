import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeriasInsightsProps {
  stats: {
    total: number;
    pendentes: number;
    aprovadas: number;
    emGozo: number;
    vencidas: number;
    abonoPecuniario: number;
  };
}

export function FeriasInsights({ stats }: FeriasInsightsProps) {
  const getInsights = () => {
    const insights = [];

    if (stats.vencidas > 0) {
      insights.push({
        type: 'critical',
        title: 'Alerta de Vencimentos',
        description: `Existem ${stats.vencidas} períodos aquisitivos vencidos. Risco de pagamento em dobro e passivo trabalhista.`,
        icon: AlertTriangle,
        color: 'text-rose-500',
        bgColor: 'bg-rose-500/10'
      });
    }

    if (stats.pendentes > 5) {
      insights.push({
        type: 'warning',
        title: 'Gargalo no Workflow',
        description: `Volume alto de solicitações pendentes (${stats.pendentes}). Verifique se há atrasos nas aprovações dos gestores.`,
        icon: TrendingDown,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10'
      });
    }

    if (stats.abonoPecuniario > stats.total * 0.5) {
      insights.push({
        type: 'info',
        title: 'Tendência de Abono',
        description: 'Mais de 50% dos colaboradores estão optando pelo abono pecuniário. Isso pode indicar necessidade de caixa extra no curto prazo.',
        icon: BrainCircuit,
        color: 'text-primary',
        bgColor: 'bg-primary/10'
      });
    }

    if (stats.vencidas === 0 && stats.pendentes < 3) {
      insights.push({
        type: 'success',
        title: 'Excelência Operacional',
        description: 'Parabéns! Sua gestão de férias está em dia, sem vencimentos e com fluxo ágil de aprovação.',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
      });
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <Card className="border-primary/20 shadow-lg shadow-primary/5 rounded-2xl overflow-hidden bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="border-b border-primary/10 bg-primary/5">
        <CardTitle className="text-sm font-display font-bold flex items-center gap-2 text-primary uppercase tracking-widest">
          <BrainCircuit className="h-4 w-4" /> Insights de IA & Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-4 p-4 rounded-xl ${insight.bgColor} border border-transparent hover:border-current/10 transition-all`}
          >
            <div className={`p-2 rounded-lg bg-background shadow-sm`}>
              <insight.icon className={`h-5 w-5 ${insight.color}`} />
            </div>
            <div className="space-y-1">
              <h4 className={`text-sm font-bold font-display ${insight.color}`}>{insight.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-body">{insight.description}</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
