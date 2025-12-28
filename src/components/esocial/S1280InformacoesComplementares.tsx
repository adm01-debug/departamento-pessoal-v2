import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, Send } from 'lucide-react';

export const S1280InformacoesComplementares: React.FC = () => {
  const [perApur, setPerApur] = useState('');
  const [status, setStatus] = useState<'rascunho' | 'validado' | 'enviado'>('rascunho');

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />S-1280 - Informações Complementares<Badge variant="outline">{status}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div><Label>Período Apuração</Label><Input type="month" value={perApur} onChange={(e) => setPerApur(e.target.value)} /></div>
        <p className="text-sm text-muted-foreground">Componente para registro de informações do evento S-1280 - Informações Complementares</p>
        <div className="flex gap-2"><Button onClick={() => setStatus('validado')}><Save className="h-4 w-4 mr-2" />Validar</Button><Button disabled={status !== 'validado'}><Send className="h-4 w-4 mr-2" />Enviar</Button></div>
      </CardContent>
    </Card>
  );
};
export default S1280InformacoesComplementares;
