/**
 * @fileoverview Componente de notificação
 * @module components/feedback/Notification
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationProps { tipo: 'info' | 'sucesso' | 'aviso' | 'erro'; titulo: string; mensagem?: string; onClose?: () => void; }

const cfg = { info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200' }, sucesso: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200' }, aviso: { icon: AlertTriangle, bg: 'bg-yellow-50', border: 'border-yellow-200' }, erro: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200' } };

export const Notification = memo(function Notification({ tipo, titulo, mensagem, onClose }: NotificationProps) {
  const { icon: Icon, bg, border } = cfg[tipo];
  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-lg border', bg, border)}>
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex-1"><p className="font-medium">{titulo}</p>{mensagem && <p className="text-sm text-muted-foreground">{mensagem}</p>}</div>
      {onClose && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>}
    </div>
  );
});
