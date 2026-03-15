import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { colaboradorService } from '@/services';
import {
  ArrowLeft, Users, Phone, DollarSign, Stethoscope,
  GraduationCap, Globe, Accessibility, Calendar, StickyNote,
  Landmark, FileText, BookOpen, FileStack
} from 'lucide-react';
import {
  DependentesTab, EmergenciaTab, HistoricoSalarialTab, ExperienciaTab,
  ASOTab, FormacaoTab, EstrangeiroTab, PCDTab, AquisitivosTab, AnotacoesTab,
  ContasBancariasTab, DocumentosPessoaisTab, EstagiarioTab, HistoricoContratosTab,
} from '@/components/colaborador-detalhes';

export default function ColaboradorDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: colaborador, isLoading } = useQuery({
    queryKey: ['colaborador', id],
    queryFn: () => colaboradorService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;
  if (!colaborador) return <div className="p-6">Colaborador não encontrado</div>;

  return (
    <PageLayout title={`${colaborador.nome_completo} — ${colaborador.cargo} · ${colaborador.departamento}`}>
      <Button variant="ghost" size="sm" onClick={() => navigate('/colaboradores')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Badge variant={colaborador.status === 'ativo' ? 'default' : 'secondary'}>
          {colaborador.status}
        </Badge>
        <span className="text-sm text-muted-foreground">CPF: {colaborador.cpf}</span>
        <span className="text-sm text-muted-foreground">Admissão: {colaborador.data_admissao}</span>
        <span className="text-sm text-muted-foreground">
          Salário: {Number(colaborador.salario_base).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>

      <Tabs defaultValue="dependentes" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="dependentes" className="text-xs"><Users className="mr-1 h-3 w-3" />Dependentes</TabsTrigger>
          <TabsTrigger value="emergencia" className="text-xs"><Phone className="mr-1 h-3 w-3" />Emergência</TabsTrigger>
          <TabsTrigger value="historico" className="text-xs"><DollarSign className="mr-1 h-3 w-3" />Hist. Salarial</TabsTrigger>
          <TabsTrigger value="contas" className="text-xs"><Landmark className="mr-1 h-3 w-3" />Contas Bancárias</TabsTrigger>
          <TabsTrigger value="experiencia" className="text-xs"><Calendar className="mr-1 h-3 w-3" />Experiência</TabsTrigger>
          <TabsTrigger value="aso" className="text-xs"><Stethoscope className="mr-1 h-3 w-3" />ASO</TabsTrigger>
          <TabsTrigger value="formacao" className="text-xs"><GraduationCap className="mr-1 h-3 w-3" />Formação</TabsTrigger>
          <TabsTrigger value="documentos" className="text-xs"><FileText className="mr-1 h-3 w-3" />Docs Pessoais</TabsTrigger>
          <TabsTrigger value="estrangeiro" className="text-xs"><Globe className="mr-1 h-3 w-3" />Estrangeiro</TabsTrigger>
          <TabsTrigger value="pcd" className="text-xs"><Accessibility className="mr-1 h-3 w-3" />PCD</TabsTrigger>
          <TabsTrigger value="estagiario" className="text-xs"><BookOpen className="mr-1 h-3 w-3" />Estagiário</TabsTrigger>
          <TabsTrigger value="aquisitivos" className="text-xs"><Calendar className="mr-1 h-3 w-3" />Per. Aquisitivos</TabsTrigger>
          <TabsTrigger value="anotacoes" className="text-xs"><StickyNote className="mr-1 h-3 w-3" />Anotações</TabsTrigger>
        </TabsList>

        <TabsContent value="dependentes"><DependentesTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="emergencia"><EmergenciaTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="historico"><HistoricoSalarialTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="contas"><ContasBancariasTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="experiencia"><ExperienciaTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="aso"><ASOTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="formacao"><FormacaoTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="documentos"><DocumentosPessoaisTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="estrangeiro"><EstrangeiroTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="pcd"><PCDTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="estagiario"><EstagiarioTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="aquisitivos"><AquisitivosTab colaboradorId={id!} /></TabsContent>
        <TabsContent value="anotacoes"><AnotacoesTab colaboradorId={id!} /></TabsContent>
      </Tabs>
    </PageLayout>
  );
}
