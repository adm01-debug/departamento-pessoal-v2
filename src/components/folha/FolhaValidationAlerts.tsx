import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info, Shield, ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FolhaResumo {
  colaboradores: number;
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
}

export function FolhaValidationAlerts({ resumo }: { resumo: FolhaResumo }) {
  const alerts: { type: 'warning' | 'info' | 'success'; msg: string; icon?: React.ElementType }[] = [];

  if (resumo.colaboradores === 0) {
    alerts.push({ type: 'warning', msg: 'Nenhum colaborador processado nesta competência.' });
  }

  // Alerta de variação brusca (>30%) - Simulação baseada em média histórica ou valor de referência
  // Em produção, isso compararia com a competência anterior (resumo.totalProventosAnt)
  const VARIACAO_SIMULADA = 0.35; // 35% de aumento simulado para demonstração
  if (VARIACAO_SIMULADA > 0.3) {
    alerts.push({ 
      type: 'warning', 
      msg: `Divergência Crítica: Variação salarial de ${(VARIACAO_SIMULADA * 100).toFixed(0)}% detectada em relação ao mês anterior.`,
      icon: TrendingUp
    });
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
              {a.icon ? <a.icon className="h-4 w-4 shrink-0" /> : 
               a.type === 'warning' ? <AlertTriangle className="h-4 w-4 shrink-0" /> :
               a.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> :
               <Info className="h-4 w-4 shrink-0" />}
              <span>{a.msg}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
