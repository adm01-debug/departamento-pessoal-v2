/**
 * @fileoverview Configuração de integração
 * @module components/integracoes/IntegracaoConfig
 */
import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Key, Clock, Save } from 'lucide-react';

interface IntegracaoConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integracao: { id: string; nome: string; apiKey?: string; webhookUrl?: string; syncInterval?: number; autoSync?: boolean; };
  onSave: (config: any) => void;
}

export const IntegracaoConfig = memo(function IntegracaoConfig({
  open, onOpenChange, integracao, onSave
}: IntegracaoConfigProps) {
  const [config, setConfig] = useState(integracao);

  const handleSave = () => {
    onSave(config);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Configurar {integracao.nome}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="credenciais">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="credenciais">Credenciais</TabsTrigger>
            <TabsTrigger value="sincronizacao">Sincronização</TabsTrigger>
          </TabsList>
          <TabsContent value="credenciais" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Key className="h-4 w-4" />API Key</Label>
              <Input type="password" value={config.apiKey || ''} onChange={e => setConfig({...config, apiKey: e.target.value})} placeholder="Sua chave de API" />
            </div>
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input value={config.webhookUrl || ''} onChange={e => setConfig({...config, webhookUrl: e.target.value})} placeholder="https://..." />
            </div>
          </TabsContent>
          <TabsContent value="sincronizacao" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Clock className="h-4 w-4" />Intervalo (minutos)</Label>
              <Input type="number" min={5} value={config.syncInterval || 60} onChange={e => setConfig({...config, syncInterval: parseInt(e.target.value)})} />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <Label>Sincronização automática</Label>
              <Switch checked={config.autoSync || false} onCheckedChange={c => setConfig({...config, autoSync: c})} />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
