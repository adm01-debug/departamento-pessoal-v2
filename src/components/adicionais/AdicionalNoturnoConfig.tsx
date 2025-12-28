import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdicionalNoturnoConfigProps {
  data?: any;
  onSave?: (data: any) => void;
}

export const AdicionalNoturnoConfig: React.FC<AdicionalNoturnoConfigProps> = ({ data, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AdicionalNoturnoConfig</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Configuração de AdicionalNoturnoConfig</p>
          <Button onClick={() => onSave?.(data)}>Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdicionalNoturnoConfig;
