import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EscalaTrabalhoEditorProps {
  value?: any;
  onChange?: (value: any) => void;
}

export const EscalaTrabalhoEditor: React.FC<EscalaTrabalhoEditorProps> = ({ value, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>EscalaTrabalhoEditor</CardTitle>
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

export default EscalaTrabalhoEditor;
