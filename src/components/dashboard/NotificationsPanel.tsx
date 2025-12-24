/**
 * @fileoverview Painel de notificações do dashboard
 * @module components/dashboard/NotificationsPanel
 */
import { memo } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  tipo: 'sucesso' | 'alerta' | 'info';
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const typeConfig = {
  sucesso: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  alerta: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

/**
 * Painel que exibe notificações do sistema
 */
export const NotificationsPanel = memo(function NotificationsPanel({ 
  notifications, 
  onMarkAsRead, 
  onDismiss 
}: NotificationsPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Notificações
          {notifications.filter(n => !n.lida).length > 0 && (
            <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.lida).length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Sem notificações</p>
        ) : (
          notifications.map((notif) => {
            const config = typeConfig[notif.tipo];
            const Icon = config.icon;
            return (
              <div key={notif.id} className={cn("p-3 rounded-lg", config.bg, !notif.lida && "ring-1 ring-primary/20")}>
                <div className="flex items-start gap-3">
                  <Icon className={cn("h-4 w-4 mt-0.5", config.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notif.titulo}</p>
                    <p className="text-xs text-muted-foreground">{notif.mensagem}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.data}</p>
                  </div>
                  {onDismiss && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDismiss(notif.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
});

