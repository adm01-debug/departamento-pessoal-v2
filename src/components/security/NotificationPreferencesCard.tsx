/**
 * @fileoverview Card de preferências de notificações de segurança
 * @module components/security/NotificationPreferencesCard
 */
import { Bell, BellOff, Shield, LogIn, Monitor, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSecurityPushNotifications } from '@/hooks/useSecurityPushNotifications';
import { toast } from 'sonner';

export function NotificationPreferencesCard() {
  const {
    isSupported,
    permission,
    preferences,
    requestPermission,
    updatePreferences,
  } = useSecurityPushNotifications();

  const handleEnableNotifications = async () => {
    if (permission === 'denied') {
      toast.error('Permissão bloqueada. Ative nas configurações do navegador.');
      return;
    }

    const granted = await requestPermission();
    if (granted) {
      updatePreferences({ enabled: true });
      toast.success('Notificações ativadas!');
    }
  };

  const handleTestNotification = async () => {
    if (permission !== 'granted') {
      toast.error('Ative as notificações primeiro');
      return;
    }

    const notification = new Notification('🔔 Teste de Notificação', {
      body: 'As notificações de segurança estão funcionando corretamente!',
      icon: '/favicon.ico',
      tag: 'test-notification',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    toast.success('Notificação de teste enviada!');
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            Notificações Push
          </CardTitle>
          <CardDescription>
            Seu navegador não suporta notificações push.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notificações Push de Segurança
            </CardTitle>
            <CardDescription>
              Receba alertas em tempo real sobre atividades de segurança
            </CardDescription>
          </div>
          <Badge
            variant={permission === 'granted' ? 'default' : 'secondary'}
            className={permission === 'granted' ? 'bg-green-500' : ''}
          >
            {permission === 'granted' ? 'Ativo' : permission === 'denied' ? 'Bloqueado' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {permission !== 'granted' ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h4 className="font-medium">Ativar Notificações</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Receba alertas instantâneos sobre atividades suspeitas
              </p>
            </div>
            <Button onClick={handleEnableNotifications}>
              <Bell className="h-4 w-4 mr-2" />
              Ativar Notificações
            </Button>
          </div>
        ) : (
          <>
            {/* Controle Principal */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Notificações Ativas</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar ou desativar todas as notificações
                </p>
              </div>
              <Switch
                checked={preferences.enabled}
                onCheckedChange={(enabled) => updatePreferences({ enabled })}
              />
            </div>

            <Separator />

            {/* Alertas por Severidade */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Alertas por Severidade
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <Label>Alertas Críticos</Label>
                  </div>
                  <Switch
                    checked={preferences.criticalAlerts}
                    onCheckedChange={(criticalAlerts) => updatePreferences({ criticalAlerts })}
                    disabled={!preferences.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <Label>Alertas Altos</Label>
                  </div>
                  <Switch
                    checked={preferences.highAlerts}
                    onCheckedChange={(highAlerts) => updatePreferences({ highAlerts })}
                    disabled={!preferences.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <Label>Alertas Médios</Label>
                  </div>
                  <Switch
                    checked={preferences.mediumAlerts}
                    onCheckedChange={(mediumAlerts) => updatePreferences({ mediumAlerts })}
                    disabled={!preferences.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <Label>Alertas Baixos</Label>
                  </div>
                  <Switch
                    checked={preferences.lowAlerts}
                    onCheckedChange={(lowAlerts) => updatePreferences({ lowAlerts })}
                    disabled={!preferences.enabled}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Outros Alertas */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Outros Alertas
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 text-primary" />
                    <Label>Alertas de Login</Label>
                  </div>
                  <Switch
                    checked={preferences.loginAlerts}
                    onCheckedChange={(loginAlerts) => updatePreferences({ loginAlerts })}
                    disabled={!preferences.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-primary" />
                    <Label>Alertas de Sessão</Label>
                  </div>
                  <Switch
                    checked={preferences.sessionAlerts}
                    onCheckedChange={(sessionAlerts) => updatePreferences({ sessionAlerts })}
                    disabled={!preferences.enabled}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Testar Notificação */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
                disabled={!preferences.enabled}
              >
                <Bell className="h-4 w-4 mr-2" />
                Testar Notificação
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default NotificationPreferencesCard;
