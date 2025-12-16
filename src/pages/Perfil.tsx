import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Bell, Shield, Palette, Mail, Phone, Building2, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Perfil() {
  const [profileData, setProfileData] = useState({
    nome: 'Ana Silva',
    email: 'ana.silva@promobrindes.com.br',
    telefone: '(11) 98765-4321',
    cargo: 'Analista de Departamento Pessoal',
    departamento: 'Recursos Humanos',
    matricula: 'PB-2024-001'
  });

  const [notifications, setNotifications] = useState({
    emailAdmissoes: true,
    emailFerias: true,
    emailDesligamentos: false,
    pushAlerts: true,
    pushVencimentos: true,
    relatorioSemanal: false
  });

  const [preferences, setPreferences] = useState({
    idioma: 'pt-BR',
    formatoData: 'dd/MM/yyyy',
    itensPerPage: '10'
  });

  const handleSaveProfile = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleSaveNotifications = () => {
    toast.success('Preferências de notificação salvas!');
  };

  const handleSavePreferences = () => {
    toast.success('Preferências do sistema salvas!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
      </div>

      {/* Profile Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">AS</AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute -bottom-1 -right-1 rounded-full w-8 h-8">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-xl font-semibold text-foreground">{profileData.nome}</h2>
              <p className="text-muted-foreground">{profileData.cargo}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {profileData.departamento}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profileData.email}
                </span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-muted-foreground">Matrícula</p>
              <p className="text-lg font-mono font-semibold text-primary">{profileData.matricula}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="dados" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="dados" className="gap-2">
            <User className="w-4 h-4" />
            Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="preferencias" className="gap-2">
            <Palette className="w-4 h-4" />
            Preferências
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Dados Pessoais */}
        <TabsContent value="dados">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações de contato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input 
                    id="nome" 
                    value={profileData.nome}
                    onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    value={profileData.telefone}
                    onChange={(e) => setProfileData({ ...profileData, telefone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input 
                    id="cargo" 
                    value={profileData.cargo}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Preferências de Notificação</CardTitle>
              <CardDescription>Configure como deseja receber alertas e atualizações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-4">Notificações por E-mail</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Novas Admissões</p>
                      <p className="text-xs text-muted-foreground">Receba alertas quando novos colaboradores forem admitidos</p>
                    </div>
                    <Switch 
                      checked={notifications.emailAdmissoes}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailAdmissoes: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Solicitações de Férias</p>
                      <p className="text-xs text-muted-foreground">Seja notificado sobre novas solicitações de férias</p>
                    </div>
                    <Switch 
                      checked={notifications.emailFerias}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailFerias: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Desligamentos</p>
                      <p className="text-xs text-muted-foreground">Alertas sobre processos de desligamento</p>
                    </div>
                    <Switch 
                      checked={notifications.emailDesligamentos}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailDesligamentos: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-foreground mb-4">Notificações Push</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Alertas Urgentes</p>
                      <p className="text-xs text-muted-foreground">Notificações sobre situações que requerem atenção imediata</p>
                    </div>
                    <Switch 
                      checked={notifications.pushAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, pushAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Vencimentos</p>
                      <p className="text-xs text-muted-foreground">Lembretes de prazos e vencimentos próximos</p>
                    </div>
                    <Switch 
                      checked={notifications.pushVencimentos}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, pushVencimentos: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Relatório Semanal</p>
                  <p className="text-xs text-muted-foreground">Receba um resumo semanal por e-mail</p>
                </div>
                <Switch 
                  checked={notifications.relatorioSemanal}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, relatorioSemanal: checked })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications} className="gap-2">
                  <Save className="w-4 h-4" />
                  Salvar Preferências
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferências */}
        <TabsContent value="preferencias">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Preferências do Sistema</CardTitle>
              <CardDescription>Personalize sua experiência no sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select value={preferences.idioma} onValueChange={(value) => setPreferences({ ...preferences, idioma: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Formato de Data</Label>
                  <Select value={preferences.formatoData} onValueChange={(value) => setPreferences({ ...preferences, formatoData: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Itens por Página</Label>
                  <Select value={preferences.itensPerPage} onValueChange={(value) => setPreferences({ ...preferences, itensPerPage: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 itens</SelectItem>
                      <SelectItem value="25">25 itens</SelectItem>
                      <SelectItem value="50">50 itens</SelectItem>
                      <SelectItem value="100">100 itens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleSavePreferences} className="gap-2">
                  <Save className="w-4 h-4" />
                  Salvar Preferências
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Segurança da Conta</CardTitle>
              <CardDescription>Gerencie a segurança da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senha-atual">Senha Atual</Label>
                  <Input id="senha-atual" type="password" placeholder="••••••••" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nova-senha">Nova Senha</Label>
                    <Input id="nova-senha" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                    <Input id="confirmar-senha" type="password" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-foreground mb-4">Sessões Ativas</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <div>
                        <p className="text-sm font-medium">Este dispositivo</p>
                        <p className="text-xs text-muted-foreground">Chrome • Windows • São Paulo, BR</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Agora</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
