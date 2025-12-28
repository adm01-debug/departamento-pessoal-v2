import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ControleAtrasosProps {
  data?: any;
  onSave?: (data: any) => void;
}

export const ControleAtrasos: React.FC<ControleAtrasosProps> = ({ data, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ControleAtrasos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Configuração de ControleAtrasos</p>
          <Button onClick={() => onSave?.(data)}>Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControleAtrasos;
