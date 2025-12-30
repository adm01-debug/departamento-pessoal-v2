import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ESocialEventoFormProps {
  evento?: string;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export function ESocialEventoForm({ evento, onSubmit, onCancel }: ESocialEventoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evento {evento || 'eSocial'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campo">Campo</Label>
            <Input id="campo" placeholder="Valor" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Enviar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ESocialEventoForm;
