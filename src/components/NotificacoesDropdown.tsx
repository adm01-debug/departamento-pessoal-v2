import { useState, useMemo, useEffect, memo } from 'react';
import { Bell, Check, CheckCheck, Trash2, RefreshCw, Calendar, FileText, Users, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificacoes, Notificacao } from '@/hooks/useNotificacoes';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const tipoConfig: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  ferias_vencendo: { icon: Calendar, color: 'text-blue-500', label: 'Férias' },
  contrato_vencendo: { icon: FileText, color: 'text-orange-500', label: 'Contrato' },
  documento_vencendo: { icon: AlertTriangle, color: 'text-yellow-500', label: 'Documento' },
  periodo_aquisitivo: { icon: Calendar, color: 'text-purple-500', label: 'Período Aquisitivo' },
};

export const NotificacoesDropdown = memo(function NotificacoesDropdown() {
  const {
    notificacoes,
    isLoading,
    naoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    excluirNotificacao,
    gerarNotificacoesAutomaticas,
    isGerando,
  } = useNotificacoes();

  const [open, setOpen] = useState(false);

  // Gerar notificações automáticas ao abrir
  useEffect(() => {
    if (open) {
      gerarNotificacoesAutomaticas();
    }
  }, [open]);

  const getIconForTipo = (tipo: string) => {
    const config = tipoConfig[tipo] || { icon: Bell, color: 'text-muted-foreground' };
    const Icon = config.icon;
    return <Icon className={cn('h-4 w-4', config.color)} />;
  };

  const formatTimeAgo = (date: string) => {
    return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: ptBR });
  };

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
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => gerarNotificacoesAutomaticas()}
              disabled={isGerando}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isGerando && "animate-spin")} />
            </Button>
            {naoLidas > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => marcarTodasComoLidas()}
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : notificacoes.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            {notificacoes.slice(0, 20).map((notificacao) => (
              <div
                key={notificacao.id}
                className={cn(
                  "flex items-start gap-3 p-3 hover:bg-accent cursor-pointer border-b last:border-b-0",
                  !notificacao.lida && "bg-accent/50"
                )}
                onClick={() => !notificacao.lida && marcarComoLida(notificacao.id)}
              >
                <div className="mt-0.5">
                  {getIconForTipo(notificacao.tipo)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-sm leading-tight",
                      !notificacao.lida && "font-medium"
                    )}>
                      {notificacao.titulo}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        excluirNotificacao(notificacao.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notificacao.mensagem}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(notificacao.created_at)}
                  </p>
                </div>
                {!notificacao.lida && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </ScrollArea>
        )}

        {notificacoes.length > 20 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 text-center text-xs text-muted-foreground">
              Mostrando 20 de {notificacoes.length} notificações
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
