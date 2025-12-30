import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AfastamentoDetailsProps {
  id?: string;
  className?: string;
}

export const AfastamentoDetails = memo(function AfastamentoDetails({ 
  id,
  className 
}: AfastamentoDetailsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Detalhes do Afastamento</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {id ? `Afastamento ID: ${id}` : 'Nenhum afastamento selecionado'}
        </p>
      </CardContent>
    </Card>
  );
});

export default AfastamentoDetails;
