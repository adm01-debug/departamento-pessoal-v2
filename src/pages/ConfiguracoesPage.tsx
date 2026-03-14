import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormSelect, FormSwitch } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ConfiguracoesPage() {
  return (
    <PageLayout
      title="Configurações"
      description="Configurações do sistema"
      icon={<Settings className="h-5 w-5 text-white" />}
      gradient="from-muted-foreground to-foreground"
    >
      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList className="bg-muted/50 rounded-xl p-1 border border-border/30">
          <TabsTrigger value="geral" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm">Geral</TabsTrigger>
          <TabsTrigger value="folha" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm">Folha</TabsTrigger>
          <TabsTrigger value="ponto" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm">Ponto</TabsTrigger>
          <TabsTrigger value="notificacoes" className="rounded-lg font-body data-[state=active]:bg-card data-[state=active]:shadow-sm">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
              <CardHeader>
                <CardTitle className="font-display">Configurações Gerais</CardTitle>
                <CardDescription className="font-body">Ajustes gerais do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Nome da Empresa" defaultValue="Minha Empresa" />
                <FormSelect label="Fuso Horário" options={[{value:'america-sp',label:'América/São Paulo'}]} />
                <FormSwitch label="Modo Escuro" description="Ativar tema escuro" />
                <Button className="rounded-xl bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg font-body">Salvar</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="folha">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-finance to-success" />
              <CardHeader><CardTitle className="font-display">Configurações de Folha</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Dia de Fechamento" type="number" defaultValue="25" />
                <FormField label="Dia de Pagamento" type="number" defaultValue="5" />
                <FormSwitch label="Calcular Automaticamente" description="Calcular folha no fechamento" />
                <Button className="rounded-xl bg-gradient-to-r from-finance to-success hover:opacity-90 shadow-lg font-body">Salvar</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="ponto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-streak to-warning" />
              <CardHeader><CardTitle className="font-display">Configurações de Ponto</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Tolerância (minutos)" type="number" defaultValue="10" />
                <FormSwitch label="Exigir Geolocalização" />
                <FormSwitch label="Exigir Foto" />
                <Button className="rounded-xl bg-gradient-to-r from-streak to-warning hover:opacity-90 shadow-lg font-body">Salvar</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notificacoes">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-info to-level" />
              <CardHeader><CardTitle className="font-display">Notificações</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormSwitch label="Email de Férias Vencendo" />
                <FormSwitch label="Email de Folha Calculada" />
                <FormSwitch label="Alertas de Documentos" />
                <Button className="rounded-xl bg-gradient-to-r from-info to-level hover:opacity-90 shadow-lg font-body">Salvar</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
