import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Heart, Save, Send } from 'lucide-react';

interface S1207Data { perApur: string; cpfBenef: string; nmBenef: string; vrBenef: number; tpBenef: string; }

export const S1207Beneficios: React.FC = () => {
  const [data, setData] = useState<S1207Data>({ perApur: '', cpfBenef: '', nmBenef: '', vrBenef: 0, tpBenef: '' });
  const [status, setStatus] = useState<'rascunho' | 'validado' | 'enviado'>('rascunho');

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" />S-1207 - Benefícios - Entes Públicos<Badge variant="outline">{status}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Período Apuração</Label><Input type="month" value={data.perApur} onChange={(e) => setData({...data, perApur: e.target.value})} /></div>
          <div><Label>CPF Beneficiário</Label><Input value={data.cpfBenef} onChange={(e) => setData({...data, cpfBenef: e.target.value})} /></div>
          <div><Label>Nome Beneficiário</Label><Input value={data.nmBenef} onChange={(e) => setData({...data, nmBenef: e.target.value})} /></div>
          <div><Label>Valor Benefício</Label><Input type="number" value={data.vrBenef} onChange={(e) => setData({...data, vrBenef: Number(e.target.value)})} /></div>
        </div>
        <div className="flex gap-2"><Button onClick={() => setStatus('validado')}><Save className="h-4 w-4 mr-2" />Validar</Button><Button disabled={status !== 'validado'}><Send className="h-4 w-4 mr-2" />Enviar</Button></div>
      </CardContent>
    </Card>
  );
};
export default S1207Beneficios;
