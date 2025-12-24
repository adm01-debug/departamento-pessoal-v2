/**
 * @fileoverview Formulário de configuração Bitrix24
 * @module components/bitrix24/Bitrix24ConfigForm
 */
import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, TestTube, Link } from 'lucide-react';

interface Bitrix24ConfigFormProps {
  config?: { webhookUrl: string; autoSync: boolean; syncInterval: number };
  onSave: (config: { webhookUrl: string; autoSync: boolean; syncInterval: number }) => void;
  onTest: (webhookUrl: string) => void;
}

export const Bitrix24ConfigForm = memo(function Bitrix24ConfigForm({ config, onSave, onTest }: Bitrix24ConfigFormProps) {
  const [formData, setFormData] = useState({ webhookUrl: config?.webhookUrl || '', autoSync: config?.autoSync || false, syncInterval: config?.syncInterval || 60 });

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Configuração Bitrix24</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Link className="h-4 w-4" />Webhook URL</Label>
          <div className="flex gap-2">
            <Input value={formData.webhookUrl} onChange={e => setFormData({...formData, webhookUrl: e.target.value})} placeholder="https://seu-dominio.bitrix24.com.br/rest/..." className="flex-1" />
            <Button variant="outline" onClick={() => onTest(formData.webhookUrl)}><TestTube className="h-4 w-4 mr-1" />Testar</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Intervalo de Sincronização (minutos)</Label>
          <Input type="number" min={5} value={formData.syncInterval} onChange={e => setFormData({...formData, syncInterval: parseInt(e.target.value)})} />
        </div>
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <Label>Sincronização Automática</Label>
          <Switch checked={formData.autoSync} onCheckedChange={c => setFormData({...formData, autoSync: c})} />
        </div>
        <Button onClick={() => onSave(formData)} className="w-full"><Save className="h-4 w-4 mr-2" />Salvar Configuração</Button>
      </CardContent>
    </Card>
  );
});
