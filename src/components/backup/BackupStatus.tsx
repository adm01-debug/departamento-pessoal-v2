/**
 * @fileoverview Card de status do último backup
 * @module components/backup/BackupStatus
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HardDrive, CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

interface BackupStatusProps {
  lastBackup?: { date: string; size: string; status: 'success' | 'failed'; };
  nextBackup?: string;
  autoBackupEnabled?: boolean;
  onBackupNow?: () => void;
  loading?: boolean;
}

/**
 * Status do sistema de backup
 */
export const BackupStatus = memo(function BackupStatus({
  lastBackup, nextBackup, autoBackupEnabled = true, onBackupNow, loading
}: BackupStatusProps) {
  const isHealthy = lastBackup?.status === 'success';

  return (
    <Card className={isHealthy ? 'border-green-200' : 'border-yellow-200'}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className={`rounded-full p-2 ${isHealthy ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <HardDrive className={`h-5 w-5 ${isHealthy ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div>
              <h3 className="font-medium flex items-center gap-2">
                Status do Backup
                {isHealthy ? (
                  <Badge variant="outline" className="text-green-600 border-green-200">Saudável</Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">Atenção</Badge>
                )}
              </h3>
              {lastBackup ? (
                <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  <p className="flex items-center gap-1">
                    {lastBackup.status === 'success' ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    )}
                    Último: {lastBackup.date} ({lastBackup.size})
                  </p>
                  {nextBackup && (
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Próximo: {nextBackup}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">Nenhum backup realizado</p>
              )}
              {!autoBackupEnabled && (
                <p className="text-xs text-yellow-600 mt-1">⚠️ Backup automático desativado</p>
              )}
            </div>
          </div>
          {onBackupNow && (
            <Button size="sm" variant="outline" onClick={onBackupNow} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Executando...' : 'Backup Agora'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
