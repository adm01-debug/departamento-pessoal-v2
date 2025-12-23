import { useState, useCallback } from 'react';
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
import { useNotificacoes, Notificacao } from '@/hooks/useNotificacoes';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type TipoNotificacao = 'info' | 'sucesso' | 'alerta' | 'erro' | 'ferias_vencendo' | 'afastamento' | 'aniversario' | 'admissao' | 'desligamento' | 'folha' | 'ponto' | 'sync' | 'contrato_vencendo' | 'documento_vencendo' | 'periodo_aquisitivo';

const tipoColors: Record<string, string> = {
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
  contrato_vencendo: 'bg-warning',
  documento_vencendo: 'bg-warning',
  periodo_aquisitivo: 'bg-warning',
};

export function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const { 
    notificacoes = [],
    naoLidas = 0,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useNotificacoes();

  // Filtrar não lidas para exibição
  const notificacoesNaoLidas = notificacoes.filter((n: Notificacao) => !n.lida);

  const handleNotificationClick = useCallback(async (notif: Notificacao) => {
    if (marcarComoLida) {
      marcarComoLida(notif.id);
    }
    // Se houver entidade, navegar para a página correspondente
    if (notif.entidade_tipo === 'colaborador' && notif.entidade_id) {
      navigate(`/colaboradores/${notif.entidade_id}`);
      setOpen(false);
    } else if (notif.entidade_tipo === 'ferias' && notif.entidade_id) {
      navigate('/ferias');
      setOpen(false);
    }
  }, [marcarComoLida, navigate]);

  const handleVerTodas = useCallback(() => {
    setOpen(false);
    navigate('/notificacoes');
  }, [navigate]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {naoLidas > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {naoLidas > 9 ? '9+' : naoLidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {naoLidas > 0 && marcarTodasComoLidas && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-1 text-xs"
              onClick={() => marcarTodasComoLidas()}
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-[300px]">
          {notificacoesNaoLidas.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {notificacoesNaoLidas.slice(0, 10).map((notif: Notificacao) => (
                <DropdownMenuItem 
                  key={notif.id}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => handleNotificationClick(notif)}
                >
                  <span 
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                      tipoColors[notif.tipo] || 'bg-muted'
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
                  {notif.entidade_id && (
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

