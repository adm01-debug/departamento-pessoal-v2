import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BeneficioDetailsProps {
  id?: string;
  nome?: string;
  valor?: number;
  className?: string;
}

export const BeneficioDetails = memo(function BeneficioDetails({ id, nome, valor, className }: BeneficioDetailsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{nome || 'Detalhes do Benefício'}</CardTitle>
      </CardHeader>
      <CardContent>
        {valor !== undefined && (
          <p className="text-2xl font-bold">
            {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        )}
        {id && <p className="text-sm text-muted-foreground">ID: {id}</p>}
      </CardContent>
    </Card>
  );
});

export default BeneficioDetails;
