import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ControleFaltasProps {
  data?: any;
  onSave?: (data: any) => void;
}

export const ControleFaltas: React.FC<ControleFaltasProps> = ({ data, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ControleFaltas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Configuração de ControleFaltas</p>
          <Button onClick={() => onSave?.(data)}>Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControleFaltas;
