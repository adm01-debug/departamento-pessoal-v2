import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Antecipacao13SalarioProps {
  data?: any;
  onSave?: (data: any) => void;
}

export const Antecipacao13Salario: React.FC<Antecipacao13SalarioProps> = ({ data, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Antecipacao13Salario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Configuração de Antecipacao13Salario</p>
          <Button onClick={() => onSave?.(data)}>Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Antecipacao13Salario;
