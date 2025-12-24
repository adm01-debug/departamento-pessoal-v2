/**
 * @fileoverview Card de Evento eSocial
 * @module components/esocial/EventoESocialCard
 * @description Exibe informações de eventos eSocial com status e ações
 */

import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  RefreshCw,
  Eye
} from 'lucide-react';

/**
 * Props do EventoESocialCard
 */
interface EventoESocialCardProps {
  /** ID do evento */
  id: string;
  /** Código do evento (ex: S-1000, S-2200) */
  codigo: string;
  /** Descrição do evento */
  descricao: string;
  /** Status do evento */
  status: 'pendente' | 'enviado' | 'processado' | 'erro' | 'cancelado';
  /** Data de geração */
  dataGeracao: string;
  /** Data de envio (se enviado) */
  dataEnvio?: string;
  /** Protocolo de recebimento */
  protocolo?: string;
  /** Callback ao visualizar */
  onView?: (id: string) => void;
  /** Callback ao enviar */
  onSend?: (id: string) => void;
  /** Callback ao reenviar */
  onRetry?: (id: string) => void;
}

/**
 * Configuração de status
 */
const statusConfig = {
  pendente: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
  enviado: { label: 'Enviado', variant: 'default' as const, icon: Send },
  processado: { label: 'Processado', variant: 'default' as const, icon: CheckCircle },
  erro: { label: 'Erro', variant: 'destructive' as const, icon: AlertCircle },
  cancelado: { label: 'Cancelado', variant: 'outline' as const, icon: AlertCircle }
};

/**
 * Card de Evento eSocial
 * @param props - Propriedades do componente
 * @returns Card com informações do evento
 */
function EventoESocialCardComponent({
  id,
  codigo,
  descricao,
  status,
  dataGeracao,
  dataEnvio,
  protocolo,
  onView,
  onSend,
  onRetry
}: EventoESocialCardProps): JSX.Element {
  const config = useMemo(() => statusConfig[status], [status]);
  const StatusIcon = config.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{codigo}</CardTitle>
          </div>
          <Badge variant={config.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{descricao}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Geração:</span>
            <span className="ml-2 font-medium">{dataGeracao}</span>
          </div>
          {dataEnvio && (
            <div>
              <span className="text-muted-foreground">Envio:</span>
              <span className="ml-2 font-medium">{dataEnvio}</span>
            </div>
          )}
          {protocolo && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Protocolo:</span>
              <span className="ml-2 font-mono text-xs">{protocolo}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView?.(id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Visualizar
          </Button>
          
          {status === 'pendente' && (
            <Button 
              size="sm" 
              onClick={() => onSend?.(id)}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-1" />
              Enviar
            </Button>
          )}
          
          {status === 'erro' && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => onRetry?.(id)}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reenviar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const EventoESocialCard = memo(EventoESocialCardComponent);
