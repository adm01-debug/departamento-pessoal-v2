import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TurnoverChart } from './TurnoverChart';
import { DesligamentoKPIs } from './DesligamentoKPIs';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export function TurnoverDashboard({ desligamentos }: { desligamentos: any[] }) {
  const totalDesligamentos = desligamentos.length;
  const pedidosDemissao = desligamentos.filter(d => d.tipo === 'pedido_demissao').length;
  
  // Taxa de turnover simplificada (em um cenário real usaria o total de colaboradores ativos)
  const turnoverRate = ((totalDesligamentos / 100) * 100).toFixed(1); // Exemplo fixo

  return (
    <div className="space-y-6">
      <DesligamentoKPIs desligamentos={desligamentos} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TurnoverChart desligamentos={desligamentos} />
        </div>
        
        <Card className="border border-border/30 rounded-2xl bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Análise de Retenção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-background border border-border/40 shadow-sm">
              <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Taxa de Turnover (Mensal)</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-display font-bold text-primary">{turnoverRate}%</span>
                <span className="text-xs text-success flex items-center gap-0.5 pb-1">
                  <TrendingUp className="h-3 w-3 rotate-180" /> -2.4%
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Principais Motivos</h4>
              {[
                { label: 'Salário & Benefícios', value: 45, color: 'bg-primary' },
                { label: 'Clima Organizacional', value: 30, color: 'bg-info' },
                { label: 'Crescimento Profissional', value: 15, color: 'bg-warning' },
                { label: 'Outros', value: 10, color: 'bg-muted-foreground/30' },
              ].map((m) => (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium">{m.label}</span>
                    <span className="text-muted-foreground">{m.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${m.value}%` }} 
                      className={`h-full ${m.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/10 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-destructive">Alerta de Turnover Crítico</p>
                <p className="text-[10px] text-muted-foreground">O departamento de "Desenvolvimento" apresentou 3 desligamentos nos últimos 60 dias.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
