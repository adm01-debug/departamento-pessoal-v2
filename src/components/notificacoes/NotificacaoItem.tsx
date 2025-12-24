/**
 * @fileoverview Item de notificação
 * @module components/notificacoes/NotificacaoItem
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Info, AlertTriangle, CheckCircle, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificacaoItemProps {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro';
  lida: boolean;
  dataHora: string;
  onMarcarLida: (id: string) => void;
  onRemover: (id: string) => void;
}

const tipoConfig = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
  sucesso: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  alerta: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  erro: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
};

export const NotificacaoItem = memo(function NotificacaoItem({
  id, titulo, mensagem, tipo, lida, dataHora, onMarcarLida, onRemover
}: NotificacaoItemProps) {
  const config = tipoConfig[tipo];
  const Icon = config.icon;
  const timeAgo = new Date(dataHora).toLocaleString('pt-BR');

  return (
    <div className={cn('flex items-start gap-3 p-3 rounded-lg transition-colors', lida ? 'bg-background' : config.bg)}>
      <div className={cn('p-2 rounded-full', config.bg)}><Icon className={cn('h-4 w-4', config.color)} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn('font-medium text-sm', !lida && 'font-semibold')}>{titulo}</h4>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onRemover(id)}><X className="h-3 w-3" /></Button>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{mensagem}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo}</span>
          {!lida && <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => onMarcarLida(id)}>Marcar como lida</Button>}
        </div>
      </div>
    </div>
  );
});
