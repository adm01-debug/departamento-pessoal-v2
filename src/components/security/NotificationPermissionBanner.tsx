/**
 * @fileoverview Banner para solicitar permissão de notificações
 * @module components/security/NotificationPermissionBanner
 */
import { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSecurityPushNotifications } from '@/hooks/useSecurityPushNotifications';
import { toast } from 'sonner';

export function NotificationPermissionBanner() {
  const { isSupported, permission, requestPermission } = useSecurityPushNotifications();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se já foi dispensado
  useEffect(() => {
    const dismissed = localStorage.getItem('notification_banner_dismissed');
    if (dismissed) setIsDismissed(true);
  }, []);

  // Não mostrar se não suportado, já tem permissão ou foi dispensado
  if (!isSupported || permission === 'granted' || permission === 'denied' || isDismissed) {
    return null;
  }

  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        toast.success('Notificações ativadas! Você receberá alertas de segurança em tempo real.');
      } else {
        toast.error('Permissão negada. Você pode ativar nas configurações do navegador.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notification_banner_dismissed', 'true');
    setIsDismissed(true);
  };

  return (
    <Alert className="mb-4 border-primary/20 bg-primary/5">
      <Bell className="h-4 w-4 text-primary" />
      <AlertTitle className="flex items-center justify-between">
        <span>Ativar Notificações de Segurança</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm text-muted-foreground mb-3">
          Receba alertas em tempo real sobre atividades suspeitas, novos logins e alterações
          de segurança na sua conta.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleRequestPermission}
            disabled={isLoading}
          >
            <Bell className="h-4 w-4 mr-2" />
            {isLoading ? 'Ativando...' : 'Ativar Notificações'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
          >
            <BellOff className="h-4 w-4 mr-2" />
            Agora Não
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default NotificationPermissionBanner;
