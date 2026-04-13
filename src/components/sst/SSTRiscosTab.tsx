import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, Flame, Users } from 'lucide-react';
import { Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const RISCOS = [
  { tipo: 'Físico', exemplos: ['Ruído', 'Vibração', 'Calor', 'Frio', 'Radiação'], cor: 'from-info to-info/70', icon: Activity },
  { tipo: 'Químico', exemplos: ['Poeiras', 'Gases', 'Vapores', 'Névoas'], cor: 'from-warning to-warning/70', icon: Flame },
  { tipo: 'Biológico', exemplos: ['Vírus', 'Bactérias', 'Fungos', 'Parasitas'], cor: 'from-success to-success/70', icon: Stethoscope },
  { tipo: 'Ergonômico', exemplos: ['Postura inadequada', 'Repetitividade', 'Esforço físico'], cor: 'from-primary to-primary-glow', icon: Users },
  { tipo: 'Acidente', exemplos: ['Queda', 'Choque elétrico', 'Incêndio', 'Máquinas'], cor: 'from-destructive to-destructive/70', icon: AlertTriangle },
];

export function SSTRiscosTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {RISCOS.map(({ tipo, exemplos, cor, icon: Icon }, i) => (
        <motion.div key={tipo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
          <Card className="border-border/30 rounded-2xl overflow-hidden">
            <div className={cn("h-[2px] bg-gradient-to-r", cor)} />
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("p-2 rounded-xl bg-gradient-to-br", cor)}><Icon className="h-4 w-4 text-primary-foreground" /></div>
                <div>
                  <p className="font-display font-semibold text-sm">Risco {tipo}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{exemplos.length} agentes identificados</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {exemplos.map(ex => <Badge key={ex} variant="outline" className="text-[10px] font-body">{ex}</Badge>)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
