import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JornadaTrabalhoConfigProps {
  value?: any;
  onChange?: (value: any) => void;
}

export const JornadaTrabalhoConfig: React.FC<JornadaTrabalhoConfigProps> = ({ value, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>JornadaTrabalhoConfig</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure a jornada de trabalho
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JornadaTrabalhoConfig;
