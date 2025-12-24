/**
 * @fileoverview Status de sincronização Bitrix24
 * @module components/bitrix24/Bitrix24SyncStatus
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface Bitrix24SyncStatusProps {
  status: 'sincronizado' | 'sincronizando' | 'erro' | 'pendente';
  ultimaSync?: string;
  progresso?: number;
  erros?: string[];
  onSync: () => void;
}

const statusConfig = {
  sincronizado: { icon: CheckCircle, color: 'text-green-500', label: 'Sincronizado' },
  sincronizando: { icon: RefreshCw, color: 'text-blue-500 animate-spin', label: 'Sincronizando...' },
  erro: { icon: XCircle, color: 'text-red-500', label: 'Erro' },
  pendente: { icon: Clock, color: 'text-yellow-500', label: 'Pendente' },
};

export const Bitrix24SyncStatus = memo(function Bitrix24SyncStatus({ status, ultimaSync, progresso, erros, onSync }: Bitrix24SyncStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Status da Sincronização</CardTitle>
        <Badge variant="outline" className="flex items-center gap-1"><Icon className={`h-4 w-4 ${config.color}`} />{config.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'sincronizando' && progresso !== undefined && <Progress value={progresso} />}
        {ultimaSync && <p className="text-sm text-muted-foreground">Última sincronização: {new Date(ultimaSync).toLocaleString('pt-BR')}</p>}
        {erros && erros.length > 0 && (
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm font-medium text-red-600 flex items-center gap-1"><AlertTriangle className="h-4 w-4" />Erros:</p>
            <ul className="text-xs text-red-600 mt-1 list-disc list-inside">{erros.map((e,i) => <li key={i}>{e}</li>)}</ul>
          </div>
        )}
        <Button onClick={onSync} disabled={status === 'sincronizando'} className="w-full"><RefreshCw className="h-4 w-4 mr-2" />Sincronizar Agora</Button>
      </CardContent>
    </Card>
  );
});
