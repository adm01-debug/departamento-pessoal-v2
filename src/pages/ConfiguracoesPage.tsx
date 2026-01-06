import React, { useState } from 'react';
import { Settings, Building, Users, Bell, Shield, Database, Palette, Globe, Mail, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { useToast } from '@/hooks/useToast';

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState('empresa');
  const { toast } = useToast();

  const save = () => toast({ title: 'Configurações salvas', description: 'As alterações foram aplicadas.' });

  return (
    <PageLayout>
      <PageHeader title="Configurações" description="Gerencie as configurações do sistema" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Configurações' }]} />
      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="empresa"><Building className="w-4 h-4 mr-2" />Empresa</TabsTrigger>
          <TabsTrigger value="usuarios"><Users className="w-4 h-4 mr-2" />Usuários</TabsTrigger>
          <TabsTrigger value="notificacoes"><Bell className="w-4 h-4 mr-2" />Notificações</TabsTrigger>
          <TabsTrigger value="seguranca"><Shield className="w-4 h-4 mr-2" />Segurança</TabsTrigger>
          <TabsTrigger value="sistema"><Settings className="w-4 h-4 mr-2" />Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">
          <Card><CardHeader><CardTitle>Dados da Empresa</CardTitle><CardDescription>Informações cadastrais</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Razão Social</Label><Input placeholder="Nome da empresa" /></div>
                <div><Label>CNPJ</Label><Input placeholder="00.000.000/0000-00" /></div>
                <div><Label>Inscrição Estadual</Label><Input /></div>
                <div><Label>Inscrição Municipal</Label><Input /></div>
              </div>
              <Button onClick={save}>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card><CardHeader><CardTitle>Preferências de Notificação</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div><p className="font-medium">Email</p><p className="text-sm text-muted-foreground">Receber notificações por email</p></div><Switch /></div>
              <div className="flex items-center justify-between"><div><p className="font-medium">Push</p><p className="text-sm text-muted-foreground">Notificações no navegador</p></div><Switch /></div>
              <div className="flex items-center justify-between"><div><p className="font-medium">WhatsApp</p><p className="text-sm text-muted-foreground">Alertas via WhatsApp</p></div><Switch /></div>
              <Button onClick={save}>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca">
          <Card><CardHeader><CardTitle>Segurança</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div><p className="font-medium">Autenticação 2FA</p><p className="text-sm text-muted-foreground">Exigir autenticação em dois fatores</p></div><Switch /></div>
              <div><Label>Tempo de sessão (minutos)</Label><Select><SelectTrigger><SelectValue placeholder="30" /></SelectTrigger><SelectContent><SelectItem value="15">15</SelectItem><SelectItem value="30">30</SelectItem><SelectItem value="60">60</SelectItem></SelectContent></Select></div>
              <div className="flex items-center justify-between"><div><p className="font-medium">Log de acessos</p><p className="text-sm text-muted-foreground">Registrar todos os acessos</p></div><Switch defaultChecked /></div>
              <Button onClick={save}>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistema">
          <Card><CardHeader><CardTitle>Sistema</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Tema</Label><Select><SelectTrigger><SelectValue placeholder="Automático" /></SelectTrigger><SelectContent><SelectItem value="light">Claro</SelectItem><SelectItem value="dark">Escuro</SelectItem><SelectItem value="auto">Automático</SelectItem></SelectContent></Select></div>
              <div><Label>Idioma</Label><Select><SelectTrigger><SelectValue placeholder="Português" /></SelectTrigger><SelectContent><SelectItem value="pt">Português</SelectItem><SelectItem value="en">English</SelectItem><SelectItem value="es">Español</SelectItem></SelectContent></Select></div>
              <div><Label>Fuso Horário</Label><Select><SelectTrigger><SelectValue placeholder="America/Sao_Paulo" /></SelectTrigger><SelectContent><SelectItem value="America/Sao_Paulo">São Paulo</SelectItem><SelectItem value="America/Manaus">Manaus</SelectItem></SelectContent></Select></div>
              <Button onClick={save}>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios"><Card><CardHeader><CardTitle>Gestão de Usuários</CardTitle></CardHeader><CardContent><Button>Gerenciar Usuários</Button></CardContent></Card></TabsContent>
      </Tabs>
    </PageLayout>
  );
}
