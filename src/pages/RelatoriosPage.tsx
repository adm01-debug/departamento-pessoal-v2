import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, DollarSign, Calendar, TrendingUp, Cake, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const relatorios = [
  { id: 'folha', title: 'Folha de Pagamento', description: 'Relatório detalhado da folha por competência', icon: DollarSign, gradient: 'from-finance to-success' },
  { id: 'colaboradores', title: 'Resumo Colaboradores', description: 'Resumo geral dos colaboradores', icon: Users, gradient: 'from-info to-level' },
  { id: 'ferias', title: 'Férias Vencidas', description: 'Colaboradores com férias vencendo', icon: Calendar, gradient: 'from-warning to-coins' },
  { id: 'aniversariantes', title: 'Aniversariantes', description: 'Aniversariantes do mês', icon: Cake, gradient: 'from-streak to-warning' },
  { id: 'turnover', title: 'Turnover', description: 'Análise de rotatividade', icon: TrendingUp, gradient: 'from-destructive to-streak' },
  { id: 'encargos', title: 'Encargos Sociais', description: 'Resumo de encargos (INSS, FGTS)', icon: FileText, gradient: 'from-primary to-primary-glow' },
];

export default function RelatoriosPage() {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Relatórios"
      description="Relatórios gerenciais e operacionais"
      icon={<BarChart3 className="h-5 w-5 text-white" />}
      gradient="from-info to-primary"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatorios.map(({ id, title, description, icon: Icon, gradient }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card
              className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden"
              onClick={() => navigate(`/relatorios/${id}`)}
            >
              <div className={cn("h-[2px] bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity", gradient)} />
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform", gradient)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-display">{title}</CardTitle>
                  <CardDescription className="font-body">{description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5 font-body">
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
}
