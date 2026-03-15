import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus, Users, TrendingUp, Star, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const modules = [
  { id: 'ciclos', title: 'Ciclos de Avaliação', description: 'Configure períodos e critérios de avaliação', icon: ClipboardList, gradient: 'from-primary to-primary/70', count: 0 },
  { id: 'metas', title: 'Metas & OKRs', description: 'Defina e acompanhe metas individuais e de equipe', icon: Target, gradient: 'from-success to-success/70', count: 0 },
  { id: '360', title: 'Feedback 360°', description: 'Avaliações multi-perspectiva dos colaboradores', icon: Users, gradient: 'from-info to-info/70', count: 0 },
  { id: 'pdi', title: 'PDI', description: 'Planos de Desenvolvimento Individual', icon: TrendingUp, gradient: 'from-warning to-warning/70', count: 0 },
  { id: 'competencias', title: 'Competências', description: 'Matriz de competências e habilidades', icon: Star, gradient: 'from-destructive to-destructive/70', count: 0 },
];

export default function AvaliacaoPage() {
  return (
    <PageLayout
      title="Avaliação de Desempenho"
      description="Ciclos, metas, feedback 360° e PDI"
      icon={<Target className="h-5 w-5 text-primary-foreground" />}
      gradient="from-warning to-primary"
      actions={
        <Button className="rounded-xl bg-gradient-to-r from-warning to-primary hover:opacity-90 shadow-lg font-body">
          <Plus className="h-4 w-4 mr-2" />Novo Ciclo
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map(({ id, title, description, icon: Icon, gradient, count }, i) => (
          <motion.div key={id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden">
              <div className={cn("h-[2px] bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity", gradient)} />
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform", gradient)}>
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base font-display">{title}</CardTitle>
                  <CardDescription className="font-body">{description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-body">{count} registros</span>
                  <Button variant="outline" size="sm" className="rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5 font-body">Acessar</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
}
