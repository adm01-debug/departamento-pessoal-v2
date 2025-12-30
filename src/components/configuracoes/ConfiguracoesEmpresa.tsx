import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ConfiguracoesEmpresa() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="razao-social">Razão Social</Label>
          <Input id="razao-social" placeholder="Razão Social" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input id="cnpj" placeholder="00.000.000/0000-00" />
        </div>
      </CardContent>
    </Card>
  );
}
