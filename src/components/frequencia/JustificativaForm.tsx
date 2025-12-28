import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface JustificativaFormProps {
  data?: any;
  onSave?: (data: any) => void;
}

export const JustificativaForm: React.FC<JustificativaFormProps> = ({ data, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>JustificativaForm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Configuração de JustificativaForm</p>
          <Button onClick={() => onSave?.(data)}>Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JustificativaForm;
