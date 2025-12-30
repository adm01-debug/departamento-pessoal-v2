import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ESocialLoteProps {
  loteId?: string;
  eventos?: string[];
  onEnviar?: () => void;
}

export function ESocialLote({ loteId, eventos = [], onEnviar }: ESocialLoteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lote {loteId || 'Novo'}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{eventos.length} eventos no lote</p>
        <Button onClick={onEnviar} className="w-full">Enviar Lote</Button>
      </CardContent>
    </Card>
  );
}

export default ESocialLote;
