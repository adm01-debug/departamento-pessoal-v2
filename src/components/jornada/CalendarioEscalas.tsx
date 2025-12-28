import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalendarioEscalasProps {
  value?: any;
  onChange?: (value: any) => void;
}

export const CalendarioEscalas: React.FC<CalendarioEscalasProps> = ({ value, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CalendarioEscalas</CardTitle>
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

export default CalendarioEscalas;
