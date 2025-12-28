import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InsalubridadeConfigProps {
  data?: any;
  onSave?: (data: any) => void;
}

export const InsalubridadeConfig: React.FC<InsalubridadeConfigProps> = ({ data, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>InsalubridadeConfig</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Configuração de InsalubridadeConfig</p>
          <Button onClick={() => onSave?.(data)}>Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsalubridadeConfig;
