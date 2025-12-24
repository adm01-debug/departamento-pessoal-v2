/**
 * @fileoverview Status de sincronização Bitrix24
 * @module components/bitrix24/Bitrix24SyncStatus
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface Bitrix24SyncStatusProps {
  status: 'idle' | 'syncing' | 'success' | 'error';
  ultimaSync?: string;
  progresso?: number;
  mensagem?: string;
  onSync: () => void;
}

const statusConfig = {
  idle: { icon: Clock, color: 'text-gray-500', label: 'Aguardando' },
  syncing: { icon: RefreshCw, color: 'text-blue-500', label: 'Sincronizando' },
  success: { icon: CheckCircle, color: 'text-green-500', label: 'Sucesso' },
  error: { icon: AlertTriangle, color: 'text-red-500', label: 'Erro' },
};

export const Bitrix24SyncStatus = memo(function Bitrix24SyncStatus({ status, ultimaSync, progresso, mensagem, onSync }: Bitrix24SyncStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color} ${status === 'syncing' ? 'animate-spin' : ''}`} />
            <span className="font-medium">Sincronização Bitrix24</span>
            <Badge variant={status === 'error' ? 'destructive' : 'outline'}>{config.label}</Badge>
          </div>
          <Button size="sm" onClick={onSync} disabled={status === 'syncing'}><RefreshCw className="h-4 w-4 mr-1" />Sincronizar</Button>
        </div>
        {status === 'syncing' && progresso !== undefined && <Progress value={progresso} className="mb-2" />}
        {mensagem && <p className="text-sm text-muted-foreground">{mensagem}</p>}
        {ultimaSync && <p className="text-xs text-muted-foreground mt-2">Última sincronização: {new Date(ultimaSync).toLocaleString('pt-BR')}</p>}
      </CardContent>
    </Card>
  );
});
