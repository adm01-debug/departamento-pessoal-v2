// V15-126: src/stories/Layout.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const meta: Meta = {
  title: 'Components/Layout',
  parameters: { layout: 'padded' },
};

export default meta;

export const DashboardCards: StoryObj = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">142</div>
          <p className="text-xs text-muted-foreground">+3 este mês</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Folha Mensal</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 485.000</div>
          <p className="text-xs text-muted-foreground">+2.5% vs mês anterior</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Férias Pendentes</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">Próximos 30 dias</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Turnover</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2.3%</div>
          <p className="text-xs text-muted-foreground">-0.5% vs mês anterior</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const TabsLayout: StoryObj = {
  render: () => (
    <Tabs defaultValue="dados" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
        <TabsTrigger value="contrato">Contrato</TabsTrigger>
        <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
      </TabsList>
      <TabsContent value="dados">
        <Card><CardHeader><CardTitle>Dados Pessoais</CardTitle></CardHeader><CardContent>Informações pessoais do colaborador</CardContent></Card>
      </TabsContent>
      <TabsContent value="contrato">
        <Card><CardHeader><CardTitle>Contrato</CardTitle></CardHeader><CardContent>Dados contratuais</CardContent></Card>
      </TabsContent>
      <TabsContent value="beneficios">
        <Card><CardHeader><CardTitle>Benefícios</CardTitle></CardHeader><CardContent>Benefícios atribuídos</CardContent></Card>
      </TabsContent>
    </Tabs>
  ),
};

export const StatusCards: StoryObj = {
  render: () => (
    <div className="flex gap-4">
      <Card className="w-64"><CardHeader><CardTitle className="flex items-center gap-2">João Silva <Badge>Ativo</Badge></CardTitle><CardDescription>Desenvolvedor Senior</CardDescription></CardHeader><CardContent><p className="text-sm">Admissão: 15/03/2023</p></CardContent><CardFooter><Button variant="outline" size="sm">Ver Perfil</Button></CardFooter></Card>
      <Card className="w-64"><CardHeader><CardTitle className="flex items-center gap-2">Maria Santos <Badge variant="secondary">Férias</Badge></CardTitle><CardDescription>Designer UX</CardDescription></CardHeader><CardContent><p className="text-sm">Retorno: 20/01/2026</p></CardContent><CardFooter><Button variant="outline" size="sm">Ver Perfil</Button></CardFooter></Card>
    </div>
  ),
};
