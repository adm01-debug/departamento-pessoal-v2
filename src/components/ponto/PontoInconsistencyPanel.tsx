import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface Inconsistency {
  id: string;
  colaborador: string;
  data: string;
  tipo: 'forgotten_out' | 'short_break' | 'geofence' | 'excessive_overtime' | 'fatigue_risk';
  descricao: string;
  gravidade: 'high' | 'medium' | 'low';
}

export function PontoInconsistencyPanel({ registros }: { registros: any[] }) {
  const detectInconsistencies = (): Inconsistency[] => {
    const list: Inconsistency[] = [];
    
    registros.forEach(r => {
      // 1. Forgotten Clock-out
      if (r.entrada_1 && !r.saida_1) {
        const dataBatida = new Date(`${r.data}T${r.entrada_1}`);
        const agora = new Date();
        const diffHoras = (agora.getTime() - dataBatida.getTime()) / (1000 * 60 * 60);
        
        if (diffHoras > 12) {
          list.push({
            id: `f-${r.id}`,
            colaborador: r.colaborador?.nome_completo || 'Colaborador',
            data: r.data,
            tipo: 'forgotten_out',
            descricao: 'Possível esquecimento de saída (mais de 12h em aberto)',
            gravidade: 'high'
          });
        }
      }

      // 2. Short Break (CLT: min 1h for >6h work)
      if (r.saida_intervalo && r.retorno_intervalo) {
        const [h1, m1] = r.saida_intervalo.split(':').map(Number);
        const [h2, m2] = r.retorno_intervalo.split(':').map(Number);
        const min1 = h1 * 60 + m1;
        const min2 = h2 * 60 + m2;
        const diff = min2 - min1;
        
        if (diff > 0 && diff < 60) {
          list.push({
            id: `b-${r.id}`,
            colaborador: r.colaborador?.nome_completo || 'Colaborador',
            data: r.data,
            tipo: 'short_break',
            descricao: `Intervalo curto: ${diff}min (Mínimo legal 60min)`,
            gravidade: 'medium'
          });
        }
      }

      // 3. Excessive Overtime (>2h)
      if (r.horas_extras) {
        // Simple check for interval format (e.g. "02:15:00")
        const extrasStr = String(r.horas_extras);
        const match = extrasStr.match(/(\d+):/);
        if (match && parseInt(match[1]) >= 2) {
          list.push({
            id: `e-${r.id}`,
            colaborador: r.colaborador?.nome_completo || 'Colaborador',
            data: r.data,
            tipo: 'excessive_overtime',
            descricao: 'Hora extra excedente ao limite legal (2h/dia)',
            gravidade: 'medium'
          });
        }
      }
    });
    
    // 4. Predictive Fatigue (Last 7 days excessive overtime)
    const overtimeByColab: Record<string, { mins: number, count: number, name: string }> = {};
    registros.forEach(r => {
      if (r.horas_extras) {
        const match = String(r.horas_extras).match(/(\d+):(\d+)/);
        if (match) {
          const mins = parseInt(match[1]) * 60 + parseInt(match[2]);
          const colabId = r.colaborador_id;
          if (!overtimeByColab[colabId]) overtimeByColab[colabId] = { mins: 0, count: 0, name: r.colaborador?.nome_completo || 'Colaborador' };
          overtimeByColab[colabId].mins += mins;
          overtimeByColab[colabId].count++;
        }
      }
    });

    Object.entries(overtimeByColab).forEach(([id, data]) => {
      if (data.mins > 480) { // More than 8 hours of overtime in the filtered period
        list.push({
          id: `fatigue-${id}`,
          colaborador: data.name,
          data: 'Alertas IA',
          tipo: 'fatigue_risk',
          descricao: `Risco de Fadiga: ${Math.round(data.mins / 60)}h extras no período (Prevenção Burnout)`,
          gravidade: 'medium'
        });
      }
    });

    return list;
  };

  const inconsistencies = detectInconsistencies();

  if (inconsistencies.length === 0) return null;

  return (
    <Card className="border-warning/30 bg-warning/5 shadow-sm mb-6">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-display flex items-center gap-2 text-warning-foreground">
          <Zap className="h-4 w-4 fill-warning" /> 
          Insights de Inteligência: {inconsistencies.length} Pendências de Conformidade
        </CardTitle>
        <Badge variant="outline" className="text-[10px] bg-warning/20 border-warning/30 text-warning-foreground">
          Auditoria Automática Ativa
        </Badge>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {inconsistencies.slice(0, 6).map((inc) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={inc.id} 
              className="bg-background/80 p-2 rounded-lg border border-border/40 flex items-start gap-3"
            >
              <div className={`mt-0.5 p-1.5 rounded-full ${
                inc.tipo === 'fatigue_risk' ? 'bg-info/10 text-info' : 
                inc.gravidade === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
              }`}>
                {inc.tipo === 'fatigue_risk' ? <ShieldAlert className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[11px] font-bold truncate">{inc.colaborador}</p>
                  <span className="text-[9px] text-muted-foreground font-mono">{inc.data}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">{inc.descricao}</p>
              </div>
            </motion.div>
          ))}
          {inconsistencies.length > 6 && (
            <div className="flex items-center justify-center p-2 rounded-lg border border-dashed border-border/60">
              <p className="text-[10px] text-muted-foreground font-medium">
                + {inconsistencies.length - 6} outras inconsistências detectadas
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
