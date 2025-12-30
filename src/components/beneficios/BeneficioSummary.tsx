import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BeneficioSummaryProps {
  totalBeneficios?: number;
  valorTotal?: number;
  className?: string;
}

export const BeneficioSummary = memo(function BeneficioSummary({ 
  totalBeneficios = 0,
  valorTotal = 0,
  className 
}: BeneficioSummaryProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Resumo de Benefícios</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-2xl font-bold">{totalBeneficios}</p>
          <p className="text-sm text-muted-foreground">Total de Benefícios</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-2xl font-bold">
            {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-sm text-muted-foreground">Valor Total</p>
        </div>
      </CardContent>
    </Card>
  );
});

export default BeneficioSummary;
