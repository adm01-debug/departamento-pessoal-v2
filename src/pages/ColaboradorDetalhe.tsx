// V15-474
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { colaboradorService } from '@/services';
import { formatarCPF } from '@/validators/cpf';
import { formatCurrency } from '@/formatters/currency';
import { Edit, FileText, Calendar, DollarSign, Clock } from 'lucide-react';
export default function ColaboradorDetalhe() {
  const { id } = useParams();
  const { data: colaborador, isLoading } = useQuery({ queryKey: ['colaborador', id], queryFn: () => colaboradorService.getById(id!), enabled: !!id });
  if (isLoading) return <Spinner size="lg" />;
  if (!colaborador) return <div>Colaborador não encontrado</div>;
  return (
    <PageLayout title={colaborador.nome} actions={<Button><Edit className="h-4 w-4 mr-2" />Editar</Button>}>
      <div className="flex items-start gap-6 mb-6">
        <Avatar className="h-24 w-24"><AvatarFallback className="text-2xl">{colaborador.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
        <div className="flex-1"><Badge variant={colaborador.status === 'ativo' ? 'default' : 'secondary'} className="mb-2">{colaborador.status}</Badge><p className="text-muted-foreground">{colaborador.cargo} - {colaborador.departamento}</p><p className="text-sm text-muted-foreground">CPF: {formatarCPF(colaborador.cpf)}</p><p className="text-lg font-bold text-primary mt-2">{formatCurrency(colaborador.salario)}</p></div>
      </div>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 flex items-center gap-3"><FileText className="h-6 w-6 text-primary" /><span className="font-medium">Documentos</span></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 flex items-center gap-3"><Calendar className="h-6 w-6 text-blue-600" /><span className="font-medium">Férias</span></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 flex items-center gap-3"><DollarSign className="h-6 w-6 text-green-600" /><span className="font-medium">Holerites</span></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 flex items-center gap-3"><Clock className="h-6 w-6 text-yellow-600" /><span className="font-medium">Ponto</span></CardContent></Card>
      </div>
      <Tabs defaultValue="dados"><TabsList><TabsTrigger value="dados">Dados Pessoais</TabsTrigger><TabsTrigger value="contrato">Contrato</TabsTrigger><TabsTrigger value="dependentes">Dependentes</TabsTrigger><TabsTrigger value="beneficios">Benefícios</TabsTrigger></TabsList>
        <TabsContent value="dados"><Card><CardContent className="pt-6 grid md:grid-cols-2 gap-4"><div><p className="text-sm text-muted-foreground">Data Nascimento</p><p>{colaborador.data_nascimento}</p></div><div><p className="text-sm text-muted-foreground">Email</p><p>{colaborador.email || '-'}</p></div><div><p className="text-sm text-muted-foreground">Telefone</p><p>{colaborador.telefone || '-'}</p></div><div><p className="text-sm text-muted-foreground">PIS</p><p>{colaborador.pis || '-'}</p></div></CardContent></Card></TabsContent>
        <TabsContent value="contrato"><Card><CardContent className="pt-6 grid md:grid-cols-2 gap-4"><div><p className="text-sm text-muted-foreground">Data Admissão</p><p>{colaborador.data_admissao}</p></div><div><p className="text-sm text-muted-foreground">Tipo Contrato</p><p>{colaborador.tipo_contrato.toUpperCase()}</p></div></CardContent></Card></TabsContent>
        <TabsContent value="dependentes"><Card><CardContent className="pt-6"><p className="text-muted-foreground">Nenhum dependente cadastrado</p></CardContent></Card></TabsContent>
        <TabsContent value="beneficios"><Card><CardContent className="pt-6"><p className="text-muted-foreground">Nenhum benefício atribuído</p></CardContent></Card></TabsContent>
      </Tabs>
    </PageLayout>
  );
}
