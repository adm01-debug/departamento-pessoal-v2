import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ColaboradorDetailsProps {
  id?: string;
  nome?: string;
  cargo?: string;
  departamento?: string;
  className?: string;
}

export const ColaboradorDetails = memo(function ColaboradorDetails({ 
  id,
  nome,
  cargo,
  departamento,
  className 
}: ColaboradorDetailsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{nome || 'Detalhes do Colaborador'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {cargo && <p><strong>Cargo:</strong> {cargo}</p>}
        {departamento && <p><strong>Departamento:</strong> {departamento}</p>}
        {id && <p className="text-sm text-muted-foreground">ID: {id}</p>}
      </CardContent>
    </Card>
  );
});

export default ColaboradorDetails;
