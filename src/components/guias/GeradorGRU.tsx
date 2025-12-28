import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Calculator, Copy } from 'lucide-react';

export const GeradorGRU: React.FC = () => {
  const [competencia, setCompetencia] = useState('');
  const [valor, setValor] = useState(0);
  const [codigoBarras, setCodigoBarras] = useState('');

  const calcular = () => { setCodigoBarras('23793.38128 60000.000003 00000.000401 1 ' + Math.random().toString().slice(2,10)); };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />GRU</CardTitle>
        <CardDescription>Guia de Recolhimento da União</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Competência</Label><Input type="month" value={competencia} onChange={(e) => setCompetencia(e.target.value)} /></div>
          <div><Label>Valor (R$)</Label><Input type="number" value={valor} onChange={(e) => setValor(Number(e.target.value))} /></div>
        </div>
        {codigoBarras && <div className="p-4 bg-muted rounded-lg"><Label>Código de Barras</Label><div className="flex gap-2 mt-2"><Input value={codigoBarras} readOnly /><Button variant="outline" size="icon"><Copy className="h-4 w-4" /></Button></div></div>}
        <div className="flex gap-2">
          <Button onClick={calcular}><Calculator className="h-4 w-4 mr-2" />Calcular</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Gerar PDF</Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default GeradorGRU;
