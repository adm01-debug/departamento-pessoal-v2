import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmprestimoConsignadoFormProps {
  data?: any;
  onSave?: (data: any) => void;
}

export const EmprestimoConsignadoForm: React.FC<EmprestimoConsignadoFormProps> = ({ data, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>EmprestimoConsignadoForm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Configuração de EmprestimoConsignadoForm</p>
          <Button onClick={() => onSave?.(data)}>Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmprestimoConsignadoForm;
