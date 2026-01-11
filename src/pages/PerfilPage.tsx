// V15-327
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FormField, FormSwitch } from '@/components/forms';
import { FormActions } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export default function PerfilPage() {
  return (
    <PageLayout title="Meu Perfil">
      <div className="flex items-center gap-6 mb-6">
        <Avatar className="h-20 w-20"><AvatarFallback className="text-2xl">AD</AvatarFallback></Avatar>
        <div><h2 className="text-xl font-bold">Administrador</h2><p className="text-muted-foreground">admin@empresa.com</p></div>
      </div>
      <Tabs defaultValue="dados">
        <TabsList><TabsTrigger value="dados">Dados</TabsTrigger><TabsTrigger value="senha">Senha</TabsTrigger><TabsTrigger value="preferencias">Preferências</TabsTrigger></TabsList>
        <TabsContent value="dados"><Card><CardContent className="pt-6 space-y-4"><FormField label="Nome" defaultValue="Administrador" /><FormField label="Email" type="email" defaultValue="admin@empresa.com" /><FormField label="Telefone" defaultValue="(11) 99999-9999" /><FormActions><Button>Salvar</Button></FormActions></CardContent></Card></TabsContent>
        <TabsContent value="senha"><Card><CardContent className="pt-6 space-y-4"><FormField label="Senha Atual" type="password" /><FormField label="Nova Senha" type="password" /><FormField label="Confirmar Senha" type="password" /><FormActions><Button>Alterar Senha</Button></FormActions></CardContent></Card></TabsContent>
        <TabsContent value="preferencias"><Card><CardContent className="pt-6 space-y-4"><FormSwitch label="Notificações por Email" /><FormSwitch label="Tema Escuro" /><FormSwitch label="Som de Notificações" /><FormActions><Button>Salvar</Button></FormActions></CardContent></Card></TabsContent>
      </Tabs>
    </PageLayout>
  );
}
