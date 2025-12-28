import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PensaoAlimenticiaConfigProps {
  data?: any;
  onSave?: (data: any) => void;
}

export const PensaoAlimenticiaConfig: React.FC<PensaoAlimenticiaConfigProps> = ({ data, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PensaoAlimenticiaConfig</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Configuração de PensaoAlimenticiaConfig</p>
          <Button onClick={() => onSave?.(data)}>Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PensaoAlimenticiaConfig;
