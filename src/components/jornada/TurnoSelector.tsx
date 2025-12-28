import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TurnoSelectorProps {
  value?: any;
  onChange?: (value: any) => void;
}

export const TurnoSelector: React.FC<TurnoSelectorProps> = ({ value, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TurnoSelector</CardTitle>
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

export default TurnoSelector;
