import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ComissoesCalculatorProps {
  data?: any;
  onSave?: (data: any) => void;
}

export const ComissoesCalculator: React.FC<ComissoesCalculatorProps> = ({ data, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ComissoesCalculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Configuração de ComissoesCalculator</p>
          <Button onClick={() => onSave?.(data)}>Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComissoesCalculator;
