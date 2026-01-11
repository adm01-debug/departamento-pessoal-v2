// V15-243: src/pages/ConfiguracoesPage.tsx
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormSelect, FormSwitch } from '@/components/forms';
import { Button } from '@/components/ui/button';

export default function ConfiguracoesPage() {
  return (
    <PageLayout title="Configurações" description="Configurações do sistema">
      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="folha">Folha</TabsTrigger>
          <TabsTrigger value="ponto">Ponto</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>
        <TabsContent value="geral">
          <Card>
            <CardHeader><CardTitle>Configurações Gerais</CardTitle><CardDescription>Ajustes gerais do sistema</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Nome da Empresa" defaultValue="Minha Empresa" />
              <FormSelect label="Fuso Horário" options={[{value:'america-sp',label:'América/São Paulo'}]} />
              <FormSwitch label="Modo Escuro" description="Ativar tema escuro" />
              <Button>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="folha">
          <Card>
            <CardHeader><CardTitle>Configurações de Folha</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Dia de Fechamento" type="number" defaultValue="25" />
              <FormField label="Dia de Pagamento" type="number" defaultValue="5" />
              <FormSwitch label="Calcular Automaticamente" description="Calcular folha no fechamento" />
              <Button>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ponto">
          <Card>
            <CardHeader><CardTitle>Configurações de Ponto</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Tolerância (minutos)" type="number" defaultValue="10" />
              <FormSwitch label="Exigir Geolocalização" />
              <FormSwitch label="Exigir Foto" />
              <Button>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader><CardTitle>Notificações</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormSwitch label="Email de Férias Vencendo" />
              <FormSwitch label="Email de Folha Calculada" />
              <FormSwitch label="Alertas de Documentos" />
              <Button>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
