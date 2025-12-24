/**
 * @fileoverview Histórico de backups do sistema
 * @module components/backup/BackupHistory
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, CheckCircle, XCircle, Clock, HardDrive } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BackupItem {
  id: string;
  date: string;
  size: string;
  type: 'manual' | 'automatico';
  status: 'concluido' | 'falha' | 'processando';
  description?: string;
}

interface BackupHistoryProps {
  backups: BackupItem[];
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

const statusConfig = {
  concluido: { icon: CheckCircle, label: 'Concluído', color: 'text-green-500' },
  falha: { icon: XCircle, label: 'Falha', color: 'text-red-500' },
  processando: { icon: Clock, label: 'Processando', color: 'text-yellow-500 animate-pulse' },
};

/**
 * Lista de backups com ações
 */
export const BackupHistory = memo(function BackupHistory({
  backups, onDownload, onDelete, loading
}: BackupHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Histórico de Backups
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : backups.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhum backup encontrado</p>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {backups.map(backup => {
                const config = statusConfig[backup.status];
                const Icon = config.icon;
                return (
                  <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${config.color}`} />
                      <div>
                        <p className="text-sm font-medium">{backup.date}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{backup.size}</span>
                          <Badge variant="outline" className="text-xs">{backup.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {backup.status === 'concluido' && onDownload && (
                        <Button variant="ghost" size="icon" onClick={() => onDownload(backup.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="icon" onClick={() => onDelete(backup.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
});
