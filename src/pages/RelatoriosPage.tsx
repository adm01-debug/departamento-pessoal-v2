// V15-229: src/pages/RelatoriosPage.tsx
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, DollarSign, Calendar, TrendingUp, Cake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const relatorios = [
  { id: 'folha', title: 'Folha de Pagamento', description: 'Relatório detalhado da folha por competência', icon: DollarSign },
  { id: 'colaboradores', title: 'Resumo Colaboradores', description: 'Resumo geral dos colaboradores', icon: Users },
  { id: 'ferias', title: 'Férias Vencidas', description: 'Colaboradores com férias vencendo', icon: Calendar },
  { id: 'aniversariantes', title: 'Aniversariantes', description: 'Aniversariantes do mês', icon: Cake },
  { id: 'turnover', title: 'Turnover', description: 'Análise de rotatividade', icon: TrendingUp },
  { id: 'encargos', title: 'Encargos Sociais', description: 'Resumo de encargos (INSS, FGTS)', icon: FileText },
];

export default function RelatoriosPage() {
  const navigate = useNavigate();

  return (
    <PageLayout title="Relatórios" description="Relatórios gerenciais e operacionais">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatorios.map(({ id, title, description, icon: Icon }) => (
          <Card key={id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/relatorios/${id}`)}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-primary/10 rounded"><Icon className="h-6 w-6 text-primary" /></div>
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">Gerar Relatório</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
