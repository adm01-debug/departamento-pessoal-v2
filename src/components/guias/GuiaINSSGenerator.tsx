import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';

interface GuiaINSSGeneratorProps {
  data?: any;
  onGenerate?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const GuiaINSSGenerator: React.FC<GuiaINSSGeneratorProps> = ({ data, onGenerate, onPrint, onDownload }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await onGenerate?.();
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          GuiaINSSGenerator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Gerador de documentos</p>
          <div className="flex gap-2">
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar'}
            </Button>
            <Button variant="outline" onClick={onPrint}><Printer className="h-4 w-4" /></Button>
            <Button variant="outline" onClick={onDownload}><Download className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuiaINSSGenerator;
