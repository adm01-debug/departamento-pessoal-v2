import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ConfiguracoesESocial() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações eSocial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="esocial-ativo">eSocial Ativo</Label>
          <Switch id="esocial-ativo" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="envio-automatico">Envio Automático</Label>
          <Switch id="envio-automatico" />
        </div>
      </CardContent>
    </Card>
  );
}
