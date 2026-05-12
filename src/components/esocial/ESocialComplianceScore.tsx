import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export function ESocialComplianceScore({ stats }: { stats: any }) {
  const score = stats.conformidade || 0;
  
  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-success';
    if (s >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBg = (s: number) => {
    if (s >= 90) return 'bg-success/10 border-success/20';
    if (s >= 70) return 'bg-warning/10 border-warning/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  return (
    <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-display flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
          Compliance eSocial Score
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between mb-4">
          <div className="space-y-1">
            <span className={`text-5xl font-display font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
            <p className="text-xs text-muted-foreground font-body">Índice de aceitação governamental</p>
          </div>
          <div className={`p-3 rounded-2xl border ${getScoreBg(score)}`}>
            <ShieldCheck className={`h-8 w-8 ${getScoreColor(score)}`} />
          </div>
        </div>
        
        <Progress value={score} className="h-2 mb-6" />

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/20">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Eventos Periódicos Sincronizados</p>
              <p className="text-[10px] text-muted-foreground">Competência atual sem pendências críticas de remuneração.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/20">
            <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Validação Antecipada Ativa</p>
              <p className="text-[10px] text-muted-foreground">Sistema interceptou 12 possíveis erros de layout este mês.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
