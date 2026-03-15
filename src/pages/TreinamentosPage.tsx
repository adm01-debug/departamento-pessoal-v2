import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Plus, BookOpen, Award, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const modules = [
  { id: 'catalogo', title: 'Catálogo de Treinamentos', description: 'Todos os treinamentos disponíveis', icon: BookOpen, gradient: 'from-info to-info/70' },
  { id: 'certificacoes', title: 'Certificações', description: 'Controle de certificações obrigatórias', icon: Award, gradient: 'from-success to-success/70' },
  { id: 'cronograma', title: 'Cronograma', description: 'Agenda de treinamentos e eventos', icon: Calendar, gradient: 'from-warning to-warning/70' },
  { id: 'participantes', title: 'Participantes', description: 'Gestão de inscrições e presença', icon: Users, gradient: 'from-primary to-primary/70' },
];

export default function TreinamentosPage() {
  return (
    <PageLayout
      title="Treinamentos"
      description="Gestão de treinamentos e desenvolvimento"
      icon={<GraduationCap className="h-5 w-5 text-primary-foreground" />}
      gradient="from-info to-primary"
      actions={
        <Button className="rounded-xl bg-gradient-to-r from-info to-primary hover:opacity-90 shadow-lg font-body">
          <Plus className="h-4 w-4 mr-2" />Novo Treinamento
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map(({ id, title, description, icon: Icon, gradient }, i) => (
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
                <Button variant="outline" size="sm" className="w-full rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5 font-body">Acessar</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
}
