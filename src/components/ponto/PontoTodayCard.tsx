import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PontoTodayCardProps {
  registroHoje: any;
}

function formatInterval(val: any) {
  if (!val) return '00:00';
  if (typeof val === 'string') {
    const match = val.match(/(\d+):(\d+)/);
    return match ? `${match[1].padStart(2, '0')}:${match[2].padStart(2, '0')}` : '00:00';
  }
  return '00:00';
}

export function PontoTodayCard({ registroHoje }: PontoTodayCardProps) {
  const pares = registroHoje ? [
    { e: registroHoje.entrada_1, s: registroHoje.saida_1 },
    { e: registroHoje.entrada_2, s: registroHoje.saida_2 },
    { e: registroHoje.entrada_3, s: registroHoje.saida_3 },
    { e: registroHoje.entrada_4, s: registroHoje.saida_4 },
    { e: registroHoje.entrada_5, s: registroHoje.saida_5 },
    { e: registroHoje.entrada_6, s: registroHoje.saida_6 },
  ].filter(p => p.e || p.s) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Timer className="h-4 w-4 text-info" /> Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          {registroHoje ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-success/10 text-center">
                  <p className="text-lg font-display font-bold text-success">{formatInterval(registroHoje.horas_trabalhadas)}</p>
                  <p className="text-[10px] text-muted-foreground font-body">Trabalhadas</p>
                </div>
                <div className="p-2 rounded-xl bg-info/10 text-center">
                  <p className="text-lg font-display font-bold text-info">{formatInterval(registroHoje.horas_extras)}</p>
                  <p className="text-[10px] text-muted-foreground font-body">Extras</p>
                </div>
                <div className="p-2 rounded-xl bg-destructive/10 text-center">
                  <p className="text-lg font-display font-bold text-destructive">{formatInterval(registroHoje.horas_falta)}</p>
                  <p className="text-[10px] text-muted-foreground font-body">Falta</p>
                </div>
              </div>

              {(registroHoje.atraso_minutos > 0 || registroHoje.saida_antecipada_minutos > 0) && (
                <div className="flex gap-2">
                  {registroHoje.atraso_minutos > 0 && (
                    <Badge variant="destructive" className="text-xs gap-1">
                      <AlertTriangle className="h-3 w-3" /> Atraso: {registroHoje.atraso_minutos}min
                    </Badge>
                  )}
                  {registroHoje.saida_antecipada_minutos > 0 && (
                    <Badge variant="outline" className="text-xs gap-1">
                      Saída antecipada: {registroHoje.saida_antecipada_minutos}min
                    </Badge>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground font-body">Registros ({registroHoje.total_batidas || 0} batidas)</p>
                {pares.length > 0 ? pares.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm font-body font-medium">{p.e || '--:--'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">→</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-body font-medium">{p.s || '--:--'}</span>
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground font-body text-center py-2">Aguardando registro</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="p-3 rounded-2xl bg-muted/50 mb-3">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground font-body">Nenhum registro hoje</p>
              <p className="text-xs text-muted-foreground/60 font-body mt-1">Registre sua entrada para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
