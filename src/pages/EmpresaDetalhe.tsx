// V15-473
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { empresaService } from '@/services';
import { formatarCNPJ } from '@/validators/cnpj';
import { Building2, Users, MapPin, Phone, Mail } from 'lucide-react';
export default function EmpresaDetalhe() {
  const { id } = useParams();
  const { data: empresa, isLoading } = useQuery({ queryKey: ['empresa', id], queryFn: () => empresaService.getById(id!), enabled: !!id });
  if (isLoading) return <Spinner size="lg" />;
  if (!empresa) return <div>Empresa não encontrada</div>;
  return (
    <PageLayout title={empresa.razao_social} description={empresa.nome_fantasia}>
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card><CardContent className="pt-6 flex items-center gap-4"><Building2 className="h-8 w-8 text-primary" /><div><p className="text-sm text-muted-foreground">CNPJ</p><p className="font-mono">{formatarCNPJ(empresa.cnpj)}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><Users className="h-8 w-8 text-green-600" /><div><p className="text-sm text-muted-foreground">Colaboradores</p><p className="text-2xl font-bold">142</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><Badge variant={empresa.status === 'ativa' ? 'default' : 'secondary'} className="mb-2">{empresa.status}</Badge><p className="text-sm text-muted-foreground">Regime: {empresa.regime_tributario?.replace('_', ' ')}</p></CardContent></Card>
      </div>
      <Tabs defaultValue="dados">
        <TabsList><TabsTrigger value="dados">Dados</TabsTrigger><TabsTrigger value="endereco">Endereço</TabsTrigger><TabsTrigger value="contato">Contato</TabsTrigger></TabsList>
        <TabsContent value="dados"><Card><CardContent className="pt-6 space-y-4"><div><p className="text-sm text-muted-foreground">Razão Social</p><p className="font-medium">{empresa.razao_social}</p></div><div><p className="text-sm text-muted-foreground">Nome Fantasia</p><p className="font-medium">{empresa.nome_fantasia || '-'}</p></div><div><p className="text-sm text-muted-foreground">Inscrição Estadual</p><p className="font-medium">{empresa.inscricao_estadual || '-'}</p></div></CardContent></Card></TabsContent>
        <TabsContent value="endereco"><Card><CardContent className="pt-6"><div className="flex items-start gap-4"><MapPin className="h-5 w-5 text-muted-foreground mt-1" /><div><p>{empresa.logradouro}, {empresa.numero}</p><p>{empresa.bairro}</p><p>{empresa.cidade} - {empresa.uf}</p><p>CEP: {empresa.cep}</p></div></div></CardContent></Card></TabsContent>
        <TabsContent value="contato"><Card><CardContent className="pt-6 space-y-4"><div className="flex items-center gap-4"><Phone className="h-5 w-5 text-muted-foreground" /><p>{empresa.telefone || '-'}</p></div><div className="flex items-center gap-4"><Mail className="h-5 w-5 text-muted-foreground" /><p>{empresa.email || '-'}</p></div></CardContent></Card></TabsContent>
      </Tabs>
    </PageLayout>
  );
}
