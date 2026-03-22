import { Card, CardContent } from '@/components/ui/card';
import { UserMinus, Clock, DollarSign, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPIProps {
  desligamentos: any[];
}

export function DesligamentoKPIs({ desligamentos }: KPIProps) {
  const total = desligamentos.length;
  const pendentes = desligamentos.filter((d) => d.status === 'pendente' || d.status === 'em_andamento').length;
  const concluidos = desligamentos.filter((d) => d.status === 'concluido' || d.status === 'finalizado').length;
  const valorTotal = desligamentos.reduce((acc: number, d: any) => acc + (d.valor_liquido || 0), 0);

  const kpis = [
    { label: 'Total Desligamentos', value: total, icon: UserMinus, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: 'Pendentes', value: pendentes, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Concluídos', value: concluidos, icon: TrendingDown, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Valor Total Rescisões', value: `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-info', bg: 'bg-info/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="border-border/30 rounded-2xl hover:shadow-elevated transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-xl p-2.5 ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-body truncate">{kpi.label}</p>
                <p className="text-lg font-display font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
