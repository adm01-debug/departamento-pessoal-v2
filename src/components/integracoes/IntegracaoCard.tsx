/**
 * @fileoverview Card de integração
 * @module components/integracoes/IntegracaoCard
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface IntegracaoCardProps {
  id: string;
  nome: string;
  descricao: string;
  icone: React.ReactNode;
  status: 'ativo' | 'inativo' | 'erro';
  ultimaSync?: string;
  onToggle: (id: string, ativo: boolean) => void;
  onConfig: (id: string) => void;
  onSync: (id: string) => void;
}

const statusConfig = {
  ativo: { icon: CheckCircle, color: 'text-green-500', label: 'Ativo' },
  inativo: { icon: XCircle, color: 'text-gray-400', label: 'Inativo' },
  erro: { icon: AlertCircle, color: 'text-red-500', label: 'Erro' },
};

export const IntegracaoCard = memo(function IntegracaoCard({
  id, nome, descricao, icone, status, ultimaSync, onToggle, onConfig, onSync
}: IntegracaoCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">{icone}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{nome}</h3>
                <StatusIcon className={`h-4 w-4 ${config.color}`} />
              </div>
              <p className="text-sm text-muted-foreground">{descricao}</p>
              {ultimaSync && <p className="text-xs text-muted-foreground mt-1">Última sync: {ultimaSync}</p>}
            </div>
          </div>
          <Switch checked={status === 'ativo'} onCheckedChange={c => onToggle(id, c)} />
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => onConfig(id)}><Settings className="h-4 w-4 mr-1" />Configurar</Button>
          <Button variant="outline" size="sm" onClick={() => onSync(id)} disabled={status !== 'ativo'}><RefreshCw className="h-4 w-4 mr-1" />Sincronizar</Button>
        </div>
      </CardContent>
    </Card>
  );
});
