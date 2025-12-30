import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';

interface CargoCardProps {
  id?: string;
  nome?: string;
  departamento?: string;
  nivel?: string;
  salarioBase?: number;
  className?: string;
}

export const CargoCard = memo(function CargoCard({ 
  id,
  nome = 'Cargo',
  departamento,
  nivel,
  salarioBase,
  className 
}: CargoCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Briefcase className="h-8 w-8 text-primary" />
        <div>
          <CardTitle className="text-lg">{nome}</CardTitle>
          {departamento && <p className="text-sm text-muted-foreground">{departamento}</p>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {nivel && <Badge variant="outline">{nivel}</Badge>}
        {salarioBase !== undefined && (
          <p className="text-lg font-semibold">
            {salarioBase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

export default CargoCard;
