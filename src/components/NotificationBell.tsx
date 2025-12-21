import { useState } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificacoes, TipoNotificacao } from '@/hooks/useNotificacoes';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const tipoColors: Record<TipoNotificacao, string> = {
  info: 'bg-info',
  sucesso: 'bg-success',
  alerta: 'bg-warning',
  erro: 'bg-destructive',
  ferias_vencendo: 'bg-warning',
  afastamento: 'bg-info',
  aniversario: 'bg-success',
  admissao: 'bg-success',
  desligamento: 'bg-destructive',
  folha: 'bg-info',
  ponto: 'bg-info',
  sync: 'bg-info',
};

export function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const { 
    naoLidas, 
    contadorNaoLidas, 
    marcarLida,
    marcarTodasLidas,
  } = useNotificacoes();

  const handleNotificationClick = async (notif: unknown) => {
    await marcarLida(notif.id);
    if (notif.link) {
      navigate(notif.link);
      setOpen(false);
    }
  };

  const handleVerTodas = () => {
    setOpen(false);
    navigate('/notificacoes');
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {contadorNaoLidas > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {contadorNaoLidas > 9 ? '9+' : contadorNaoLidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {contadorNaoLidas > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-1 text-xs"
              onClick={() => marcarTodasLidas()}
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-[300px]">
          {!naoLidas || naoLidas.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {naoLidas.slice(0, 10).map((notif) => (
                <DropdownMenuItem 
                  key={notif.id}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => handleNotificationClick(notif)}
                >
                  <span 
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                      tipoColors[notif.tipo]
                    )} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{notif.titulo}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.mensagem}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(notif.created_at), "dd/MM HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  {notif.link && (
                    <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-center justify-center text-primary cursor-pointer"
          onClick={handleVerTodas}
        >
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
