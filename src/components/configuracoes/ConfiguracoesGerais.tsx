import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ConfiguracoesGerais() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notificacoes">Notificações</Label>
          <Switch id="notificacoes" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="tema-escuro">Tema Escuro</Label>
          <Switch id="tema-escuro" />
        </div>
      </CardContent>
    </Card>
  );
}
