import { PageTitle } from '@/components/PageTitle';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserSearch, Plus, Briefcase, Users, Filter, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const modules = [
  { id: 'vagas', title: 'Vagas Abertas', description: 'Gerencie as vagas disponíveis', icon: Briefcase, gradient: 'from-success to-success/70', count: 0 },
  { id: 'candidatos', title: 'Candidatos', description: 'Base de candidatos e currículos', icon: Users, gradient: 'from-info to-info/70', count: 0 },
  { id: 'pipeline', title: 'Pipeline', description: 'Funil de recrutamento por etapa', icon: Filter, gradient: 'from-warning to-warning/70', count: 0 },
  { id: 'analytics', title: 'Analytics', description: 'Métricas de recrutamento', icon: BarChart3, gradient: 'from-primary to-primary/70', count: 0 },
];

export default function RecrutamentoPage() {
  return (
    <>
    <PageTitle title="Recrutamento" description="Gestão de processos seletivos" />
    <PageLayout
      title="Recrutamento & Seleção"
      description="Gestão de vagas, candidatos e pipeline"
      icon={<UserSearch className="h-5 w-5 text-primary-foreground" />}
      gradient="from-success to-info"
      actions={
        <Button className="rounded-xl bg-gradient-to-r from-success to-info hover:opacity-90 shadow-lg font-body">
          <Plus className="h-4 w-4 mr-2" />Nova Vaga
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
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
    </>
  );
}
