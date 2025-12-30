import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuditoriaDetailsProps {
  id?: string;
  className?: string;
}

export const AuditoriaDetails = memo(function AuditoriaDetails({ id, className }: AuditoriaDetailsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Detalhes da Auditoria</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {id ? `Registro ID: ${id}` : 'Nenhum registro selecionado'}
        </p>
      </CardContent>
    </Card>
  );
});

export default AuditoriaDetails;
