// V15-275: src/components/esocial/EventoCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Evento {
  codigo: string;
  nome: string;
  status: 'enviado' | 'pendente' | 'erro' | 'processando';
  dataEnvio?: string;
  mensagem?: string;
}

interface EventoCardProps {
  evento: Evento;
  onEnviar?: () => void;
  onReenviar?: () => void;
  onVisualizar?: () => void;
}

const statusConfig = {
  enviado: { icon: CheckCircle, variant: 'success', color: 'text-green-600' },
  pendente: { icon: Clock, variant: 'warning', color: 'text-yellow-600' },
  erro: { icon: AlertCircle, variant: 'error', color: 'text-red-600' },
  processando: { icon: RefreshCw, variant: 'info', color: 'text-blue-600' },
};

export function EventoCard({ evento, onEnviar, onReenviar, onVisualizar }: EventoCardProps) {
  const config = statusConfig[evento.status];
  const Icon = config.icon;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <div>
              <p className="font-medium">{evento.codigo} - {evento.nome}</p>
              {evento.dataEnvio && <p className="text-sm text-muted-foreground">Enviado em {evento.dataEnvio}</p>}
              {evento.mensagem && <p className="text-sm text-red-600">{evento.mensagem}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={evento.status} variant={config.variant as any} />
            {evento.status === 'pendente' && onEnviar && <Button size="sm" onClick={onEnviar}><Send className="h-4 w-4 mr-1" />Enviar</Button>}
            {evento.status === 'erro' && onReenviar && <Button size="sm" variant="destructive" onClick={onReenviar}><RefreshCw className="h-4 w-4 mr-1" />Reenviar</Button>}
            {onVisualizar && <Button size="sm" variant="ghost" onClick={onVisualizar}><Eye className="h-4 w-4" /></Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
