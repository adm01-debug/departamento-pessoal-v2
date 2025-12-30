import { useState, memo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MaskedInput } from '@/components/ui/masked-input';
import { User, Bell, Shield, Palette, Mail, Building2, Camera, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';

// Validation schemas
const profileSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
  telefone: z.string().optional(),
});

const passwordSchema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  confirmarSenha: z.string(),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: 'Senhas não coincidem',
  path: ['confirmarSenha'],
});

type ProfileErrors = { nome?: string; telefone?: string };
type PasswordErrors = { senhaAtual?: string; novaSenha?: string; confirmarSenha?: string };

export default memo(function Perfil() {
  useEffect(() => { document.title = 'Perfil | DP System'; }, []);

  const { user, profile, updateProfile } = useAuth();
  
  const [profileData, setProfileData] = useState({
    nome: '',
    telefone: '',
    cargo: '',
    departamento: '',
  });

  const [originalProfileData, setOriginalProfileData] = useState({ ...profileData });
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});

  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

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

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: '', description: '', onConfirm: () => {} });

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      const data = {
        nome: profile.nome ?? '',
        telefone: profile.telefone ?? '',
        cargo: profile.cargo || 'Usuário',
        departamento: profile.departamento ?? '',
      };
      setProfileData(data);
      setOriginalProfileData(data);
    }
  }, [profile]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const hasProfileChanges = () => {
    return profileData.nome !== originalProfileData.nome ||
           profileData.telefone !== originalProfileData.telefone;
  };

  const validateProfile = () => {
    const result = profileSchema.safeParse(profileData);
    if (!result.success) {
      const errors: ProfileErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ProfileErrors;
        errors[field] = err.message;
      });
      setProfileErrors(errors);
      return false;
    }
    setProfileErrors({});
    return true;
  };

  const validatePassword = () => {
    const result = passwordSchema.safeParse(passwordData);
    if (!result.success) {
      const errors: PasswordErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof PasswordErrors;
        errors[field] = err.message;
      });
      setPasswordErrors(errors);
      return false;
    }
    setPasswordErrors({});
    return true;
  };

  const handleSaveProfile = () => {
    if (!validateProfile()) {
      toast.error('Corrija os erros antes de salvar');
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Confirmar alterações',
      description: 'Deseja salvar as alterações no seu perfil? Esta ação atualizará suas informações pessoais.',
      onConfirm: async () => {
        const { error } = await updateProfile({
          nome: profileData.nome,
          telefone: profileData.telefone,
        });
        if (error) {
          toast.error('Erro ao atualizar perfil');
        } else {
          toast.success('Perfil atualizado com sucesso!');
          setOriginalProfileData({ ...profileData });
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleSaveNotifications = () => {
    setConfirmDialog({
      open: true,
      title: 'Salvar preferências de notificação',
      description: 'Deseja salvar suas preferências de notificação?',
      onConfirm: () => {
        toast.success('Preferências de notificação salvas!');
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleSavePreferences = () => {
    setConfirmDialog({
      open: true,
      title: 'Salvar preferências do sistema',
      description: 'Deseja salvar suas preferências do sistema?',
      onConfirm: () => {
        toast.success('Preferências do sistema salvas!');
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleChangePassword = () => {
    if (!validatePassword()) {
      toast.error('Corrija os erros antes de alterar a senha');
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Alterar senha',
      description: 'Tem certeza que deseja alterar sua senha? Você precisará usar a nova senha no próximo login.',
      onConfirm: () => {
        toast.success('Senha alterada com sucesso!');
        setPasswordData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  return (
    <div id="main-content" className="space-y-6">
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              {confirmDialog.title}
            </DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button aria-label="Ação" variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
              Cancelar
            </Button>
            <Button aria-label="Ação" onClick={confirmDialog.onConfirm}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <AvatarImage src={profile?.avatar_url ?? ''} />
                <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                  {profileData.nome ? getInitials(profileData.nome) : '??'}
                </AvatarFallback>
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
                  {profileData.departamento || 'Não definido'}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-muted-foreground">ID do Usuário</p>
              <p className="text-sm font-mono font-medium text-primary truncate max-w-[150px]">{user?.id?.slice(0, 8)}...</p>
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
                    onChange={(e) => {
                      setProfileData({ ...profileData, nome: e.target.value });
                      if (profileErrors.nome) setProfileErrors({ ...profileErrors, nome: undefined });
                    }}
                    className={profileErrors.nome ? 'border-destructive' : ''}
                  />
                  {profileErrors.nome && (
                    <p className="text-xs text-destructive">{profileErrors.nome}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <MaskedInput 
                    id="telefone"
                    mask="phone"
                    value={profileData.telefone}
                    onValueChange={(_, maskedValue) => {
                      setProfileData({ ...profileData, telefone: maskedValue });
                      if (profileErrors.telefone) setProfileErrors({ ...profileErrors, telefone: undefined });
                    }}
                    className={profileErrors.telefone ? 'border-destructive' : ''}
                  />
                  {profileErrors.telefone && (
                    <p className="text-xs text-destructive">{profileErrors.telefone}</p>
                  )}
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
                <Button 
                  onClick={handleSaveProfile} 
                  className="gap-2"
                  disabled={!hasProfileChanges()}
                >
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
                <Button aria-label="Ação" onClick={handleSaveNotifications} className="gap-2">
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
                <Button aria-label="Ação" onClick={handleSavePreferences} className="gap-2">
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
                  <Input 
                    id="senha-atual" 
                    type="password" 
                    placeholder="••••••••"
                    value={passwordData.senhaAtual}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, senhaAtual: e.target.value });
                      if (passwordErrors.senhaAtual) setPasswordErrors({ ...passwordErrors, senhaAtual: undefined });
                    }}
                    className={passwordErrors.senhaAtual ? 'border-destructive' : ''}
                  />
                  {passwordErrors.senhaAtual && (
                    <p className="text-xs text-destructive">{passwordErrors.senhaAtual}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nova-senha">Nova Senha</Label>
                    <Input 
                      id="nova-senha" 
                      type="password" 
                      placeholder="••••••••"
                      value={passwordData.novaSenha}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, novaSenha: e.target.value });
                        if (passwordErrors.novaSenha) setPasswordErrors({ ...passwordErrors, novaSenha: undefined });
                      }}
                      className={passwordErrors.novaSenha ? 'border-destructive' : ''}
                    />
                    {passwordErrors.novaSenha && (
                      <p className="text-xs text-destructive">{passwordErrors.novaSenha}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, 1 maiúscula e 1 número</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                    <Input 
                      id="confirmar-senha" 
                      type="password" 
                      placeholder="••••••••"
                      value={passwordData.confirmarSenha}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, confirmarSenha: e.target.value });
                        if (passwordErrors.confirmarSenha) setPasswordErrors({ ...passwordErrors, confirmarSenha: undefined });
                      }}
                      className={passwordErrors.confirmarSenha ? 'border-destructive' : ''}
                    />
                    {passwordErrors.confirmarSenha && (
                      <p className="text-xs text-destructive">{passwordErrors.confirmarSenha}</p>
                    )}
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
                <Button 
                  onClick={handleChangePassword} 
                  className="gap-2"
                  disabled={!passwordData.senhaAtual && !passwordData.novaSenha && !passwordData.confirmarSenha}
                >
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
});
