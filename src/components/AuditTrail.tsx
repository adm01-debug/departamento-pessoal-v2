import { memo } from 'react';
import { Activity, User, Clock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useHistoricoRegistro, AuditLog } from '@/hooks/useAuditoria';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AuditTrailProps {
  entidade: string;
  entidadeId: string;
  maxItems?: number;
  className?: string;
}

const acaoLabels: Record<string, string> = {
  INSERT: 'Criou',
  UPDATE: 'Editou',
  DELETE: 'Excluiu',
  criar: 'Criou',
  editar: 'Editou',
  excluir: 'Excluiu',
  visualizar: 'Visualizou',
  exportar: 'Exportou',
  importar: 'Importou',
  aprovar: 'Aprovou',
  rejeitar: 'Rejeitou',
  login: 'Login',
  logout: 'Logout',
  sync: 'Sincronizou',
};

const acaoColors: Record<string, string> = {
  INSERT: 'bg-success/20 text-success',
  UPDATE: 'bg-info/20 text-info',
  DELETE: 'bg-destructive/20 text-destructive',
  criar: 'bg-success/20 text-success',
  editar: 'bg-info/20 text-info',
  excluir: 'bg-destructive/20 text-destructive',
  visualizar: 'bg-muted text-muted-foreground',
  exportar: 'bg-warning/20 text-warning',
  importar: 'bg-warning/20 text-warning',
  aprovar: 'bg-success/20 text-success',
  rejeitar: 'bg-destructive/20 text-destructive',
  login: 'bg-info/20 text-info',
  logout: 'bg-muted text-muted-foreground',
  sync: 'bg-info/20 text-info',
};

export const AuditTrail = memo(function AuditTrail({ entidade, entidadeId, maxItems = 10, className }: AuditTrailProps) {
  const { data: logs = [], isLoading } = useHistoricoRegistro(entidade, entidadeId);

  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhuma atividade registrada</p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-[300px]", className)}>
      <div className="space-y-4 pr-4">
        {logs.slice(0, maxItems).map((log: AuditLog, index: number) => (
          <div key={log.id} className="relative flex gap-3">
            {/* Timeline line */}
            {index < logs.slice(0, maxItems).length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
            )}
            
            {/* Icon */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10",
              acaoColors[log.acao] || 'bg-muted'
            )}>
              <FileText className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {acaoLabels[log.acao] || log.acao}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              
              <p className="text-sm mt-1">{log.descricao || `Ação: ${log.acao} na tabela ${log.tabela}`}</p>
              
              {log.user_email && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {log.user_email}
                </p>
              )}

              {/* Mostrar diferenças se houver */}
              {log.dados_anteriores && log.dados_novos && (
                <div className="mt-2 text-xs bg-muted p-2 rounded">
                  <p className="font-medium mb-1">Alterações:</p>
                  {Object.keys(log.dados_novos).map(key => {
                    const anterior = log.dados_anteriores?.[key];
                    const novo = log.dados_novos?.[key];
                    if (anterior !== novo) {
                      return (
                        <p key={key} className="text-muted-foreground">
                          <span className="font-medium">{key}:</span>{' '}
                          <span className="line-through">{String(anterior || '-')}</span>{' → '}
                          <span className="text-foreground">{String(novo || '-')}</span>
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
});

export default AuditTrail;
