import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DescontosResumidoProps {
  data?: any;
  onSave?: (data: any) => void;
}

export const DescontosResumido: React.FC<DescontosResumidoProps> = ({ data, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DescontosResumido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Configuração de DescontosResumido</p>
          <Button onClick={() => onSave?.(data)}>Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DescontosResumido;
