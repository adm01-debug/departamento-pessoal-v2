import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertTriangle, Clock, Heart, Calendar } from 'lucide-react';

interface AfastamentoStatsProps {
  stats: {
    total: number;
    ativos: number;
    pendentes: number;
    finalizados: number;
    diasTotais: number;
  };
}

export function AfastamentoStats({ stats }: AfastamentoStatsProps) {
  const kpis = [
    { label: 'Total', value: stats.total, icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Ativos', value: stats.ativos, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Pendentes', value: stats.pendentes, icon: Clock, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Finalizados', value: stats.finalizados, icon: Heart, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Dias Totais', value: stats.diasTotais, icon: Calendar, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className={`p-3 rounded-xl ${kpi.bg} mb-3`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <p className={`text-2xl font-display font-bold ${kpi.color}`}>
                {kpi.value}
              </p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                {kpi.label}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
