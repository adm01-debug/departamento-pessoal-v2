import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Upload, Download, CheckCircle } from 'lucide-react';

export const EFDReinf: React.FC = () => {
  const [anoCalendario, setAnoCalendario] = useState(new Date().getFullYear() - 1);
  const [status, setStatus] = useState<'pendente' | 'gerada' | 'transmitida'>('pendente');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5" />EFD-Reinf<Badge variant={status === 'transmitida' ? 'default' : 'outline'}>{status}</Badge></CardTitle>
        <CardDescription>Escrituração Fiscal Digital de Retenções</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div><Label>Ano-Calendário</Label><Input type="number" value={anoCalendario} onChange={(e) => setAnoCalendario(Number(e.target.value))} /></div>
        <div className="flex gap-2">
          <Button onClick={() => setStatus('gerada')}><CheckCircle className="h-4 w-4 mr-2" />Gerar Declaração</Button>
          <Button variant="outline" disabled={status !== 'gerada'} onClick={() => setStatus('transmitida')}><Upload className="h-4 w-4 mr-2" />Transmitir</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default EFDReinf;
