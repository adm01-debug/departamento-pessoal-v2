/**
 * @fileoverview Lista de logs de auditoria
 * @module components/auditoria/AuditLogList
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AuditLogItem } from './AuditLogItem';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'export' | 'view';
  entity: string;
  entityId?: string;
  description: string;
  user: { name: string; avatar?: string; };
  timestamp: string;
  ip?: string;
  changes?: { field: string; old?: string; new?: string; }[];
}

interface AuditLogListProps {
  logs: AuditLog[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onViewDetails?: (id: string) => void;
}

/**
 * Lista paginada de logs de auditoria
 */
export const AuditLogList = memo(function AuditLogList({
  logs, loading, page = 1, totalPages = 1, onPageChange, onViewDetails
}: AuditLogListProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Carregando logs...</p>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Nenhum log encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Histórico de Atividades</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {logs.map(log => (
            <AuditLogItem key={log.id} {...log} onViewDetails={onViewDetails} />
          ))}
        </ScrollArea>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
