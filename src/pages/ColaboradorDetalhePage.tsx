// V15-245: src/pages/ColaboradorDetalhePage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ColaboradorStatus } from '@/components/ui/status-badge';
import { Spinner } from '@/components/ui/spinner';
import { colaboradorService } from '@/services';
import { Edit, FileText, Calendar, DollarSign } from 'lucide-react';

export default function ColaboradorDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: colaborador, isLoading } = useQuery({
    queryKey: ['colaborador', id],
    queryFn: () => colaboradorService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;
  if (!colaborador) return <div>Colaborador não encontrado</div>;

  const initials = colaborador.nome.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <PageLayout title="" actions={<Button onClick={() => navigate(`/colaboradores/${id}/editar`)}><Edit className="h-4 w-4 mr-2" />Editar</Button>}>
      <div className="flex items-center gap-6 mb-6">
        <Avatar className="h-20 w-20">
          {colaborador.foto_url && <AvatarImage src={colaborador.foto_url} />}
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{colaborador.nome}</h1>
          <p className="text-muted-foreground">{colaborador.cargo || 'Sem cargo'}</p>
          <div className="mt-2"><ColaboradorStatus status={colaborador.status} /></div>
        </div>
      </div>
      <Tabs defaultValue="dados" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="ferias">Férias</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="dados">
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle>Dados Pessoais</CardTitle></CardHeader><CardContent className="space-y-2">
              <p><strong>CPF:</strong> {colaborador.cpf}</p>
              <p><strong>Email:</strong> {colaborador.email || '-'}</p>
              <p><strong>Telefone:</strong> {colaborador.telefone || '-'}</p>
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Dados Profissionais</CardTitle></CardHeader><CardContent className="space-y-2">
              <p><strong>Admissão:</strong> {colaborador.data_admissao}</p>
              <p><strong>Salário:</strong> {colaborador.salario?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <p><strong>Contrato:</strong> {colaborador.tipo_contrato}</p>
            </CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="documentos"><Card><CardContent className="p-6">Lista de documentos</CardContent></Card></TabsContent>
        <TabsContent value="ferias"><Card><CardContent className="p-6">Histórico de férias</CardContent></Card></TabsContent>
        <TabsContent value="historico"><Card><CardContent className="p-6">Histórico salarial</CardContent></Card></TabsContent>
      </Tabs>
    </PageLayout>
  );
}
