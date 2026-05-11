import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditoriaService } from '@/services';
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Building2, 
  Shield, 
  ArrowRight,
  Loader2,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface FeriasAuditTimelineProps {
  solicitacaoId: string;
}

export function FeriasAuditTimeline({ solicitacaoId }: FeriasAuditTimelineProps) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['ferias-audit', solicitacaoId],
    queryFn: () => auditoriaService.listar({ 
      registro_id: solicitacaoId,
      tabela: 'ferias',
      limite: 20 
    }),
    enabled: !!solicitacaoId
  });

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
    </div>
  );

  if (!logs?.length) return (
    <div className="text-center p-8 text-muted-foreground text-sm font-body">
      Nenhuma trilha de auditoria encontrada para esta solicitação.
    </div>
  );

  const getIcon = (acao: string) => {
    switch (acao) {
      case 'INSERT': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'UPDATE': return <History className="h-4 w-4 text-primary" />;
      default: return <History className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatPayload = (log: any) => {
    try {
      const payload = log.payload || {};
      if (payload.aprovado_rh) return 'Aprovação final confirmada pelo RH';
      if (payload.aprovado_gestor) return 'Solicitação aprovada pelo gestor direto';
      if (payload.enviado_contabilidade) return 'Enviado para processamento na contabilidade';
      if (payload.status === 'rejeitada') return 'Solicitação rejeitada';
      if (payload.cancelado) return 'Solicitação cancelada pelo sistema/usuário';
      return log.acao === 'INSERT' ? 'Nova solicitação criada' : 'Registro atualizado';
    } catch (e) {
      return 'Alteração no registro';
    }
  };

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border/40">
        {logs.map((log, i) => (
          <div key={log.id} className="relative pl-12">
            <div className="absolute left-0 p-2 rounded-full bg-background border border-border shadow-sm z-10">
              {getIcon(log.acao)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold font-display">{formatPayload(log)}</p>
                <span className="text-[10px] text-muted-foreground font-body">
                  {format(new Date(log.created_at), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] h-4 bg-muted/50 border-none font-body">
                  {log.user_email || 'Sistema'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
