/**
 * @fileoverview Card de integração contábil
 * @module components/contabil/IntegracaoContabilCard
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Building, Settings, CheckCircle, XCircle } from 'lucide-react';

interface IntegracaoContabilCardProps {
  id: string;
  nome: string;
  descricao: string;
  conectado: boolean;
  ultimaSync?: string;
  onToggle: (id: string, ativo: boolean) => void;
  onConfig: (id: string) => void;
}

export const IntegracaoContabilCard = memo(function IntegracaoContabilCard({
  id, nome, descricao, conectado, ultimaSync, onToggle, onConfig
}: IntegracaoContabilCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Building className="h-5 w-5 text-primary" /></div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{nome}</h3>
                {conectado ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-gray-400" />}
              </div>
              <p className="text-sm text-muted-foreground">{descricao}</p>
              {ultimaSync && <p className="text-xs text-muted-foreground mt-1">Última sync: {ultimaSync}</p>}
            </div>
          </div>
          <Switch checked={conectado} onCheckedChange={c => onToggle(id, c)} />
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => onConfig(id)}><Settings className="h-4 w-4 mr-1" />Configurar</Button>
        </div>
      </CardContent>
    </Card>
  );
});
