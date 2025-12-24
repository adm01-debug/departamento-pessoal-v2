/**
 * @fileoverview Lista de notificações
 * @module components/notificacoes/NotificacaoList
 */
import { memo } from 'react';
import { NotificacaoItem } from './NotificacaoItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro';
  lida: boolean;
  dataHora: string;
}

interface NotificacaoListProps {
  notificacoes: Notificacao[];
  onMarcarLida: (id: string) => void;
  onMarcarTodasLidas: () => void;
  onRemover: (id: string) => void;
}

export const NotificacaoList = memo(function NotificacaoList({
  notificacoes, onMarcarLida, onMarcarTodasLidas, onRemover
}: NotificacaoListProps) {
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  if (notificacoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Bell className="h-12 w-12 mb-4 opacity-50" />
        <p>Nenhuma notificação</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {naoLidas > 0 && (
        <div className="flex justify-between items-center px-2">
          <span className="text-sm text-muted-foreground">{naoLidas} não lida(s)</span>
          <Button variant="ghost" size="sm" onClick={onMarcarTodasLidas}><CheckCheck className="h-4 w-4 mr-1" />Marcar todas</Button>
        </div>
      )}
      <ScrollArea className="h-[400px]">
        <div className="space-y-2 p-1">
          {notificacoes.map(notif => (
            <NotificacaoItem key={notif.id} {...notif} onMarcarLida={onMarcarLida} onRemover={onRemover} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});
