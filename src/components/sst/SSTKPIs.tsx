import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle, HardHat, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SSTKPIsProps {
  validos: number;
  vencendo: number;
  vencidos: number;
  totalEpis: number;
  totalEntregas: number;
}

export function SSTKPIs({ validos, vencendo, vencidos, totalEpis, totalEntregas }: SSTKPIsProps) {
  const items = [
    { label: 'ASOs Válidos', value: validos, icon: CheckCircle, gradient: 'from-success to-success/70' },
    { label: 'Vencendo 30d', value: vencendo, icon: Clock, gradient: 'from-warning to-warning/70' },
    { label: 'Vencidos', value: vencidos, icon: AlertTriangle, gradient: 'from-destructive to-destructive/70' },
    { label: 'EPIs Cadastrados', value: totalEpis, icon: HardHat, gradient: 'from-info to-info/70' },
    { label: 'Entregas EPI', value: totalEntregas, icon: Users, gradient: 'from-primary to-primary-glow' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {items.map(({ label, value, icon: Icon, gradient }, i) => (
        <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="border-border/30 rounded-2xl overflow-hidden">
            <div className={cn("h-[2px] bg-gradient-to-r", gradient)} />
            <CardContent className="p-3 flex items-center gap-3">
              <div className={cn("p-2 rounded-xl bg-gradient-to-br", gradient)}><Icon className="h-4 w-4 text-primary-foreground" /></div>
              <div><p className="text-lg font-bold font-display">{value}</p><p className="text-[10px] text-muted-foreground font-body">{label}</p></div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
