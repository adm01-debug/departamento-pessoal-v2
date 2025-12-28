import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, Send } from 'lucide-react';

export const S2240CondicoesAmbientais: React.FC = () => {
  const [perApur, setPerApur] = useState('');
  const [cpfTrab, setCpfTrab] = useState('');
  const [status, setStatus] = useState<'rascunho' | 'validado' | 'enviado'>('rascunho');

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />S-2240 - Condições Ambientais do Trabalho<Badge variant="outline">{status}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Período Apuração</Label><Input type="month" value={perApur} onChange={(e) => setPerApur(e.target.value)} /></div>
          <div><Label>CPF Trabalhador</Label><Input value={cpfTrab} onChange={(e) => setCpfTrab(e.target.value)} placeholder="000.000.000-00" /></div>
        </div>
        <p className="text-sm text-muted-foreground">Evento S-2240 - Condições Ambientais do Trabalho - preencha os campos obrigatórios</p>
        <div className="flex gap-2"><Button onClick={() => setStatus('validado')}><Save className="h-4 w-4 mr-2" />Validar</Button><Button disabled={status !== 'validado'}><Send className="h-4 w-4 mr-2" />Enviar</Button></div>
      </CardContent>
    </Card>
  );
};
export default S2240CondicoesAmbientais;
