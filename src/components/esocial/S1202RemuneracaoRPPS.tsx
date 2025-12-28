import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wallet, Save, Send } from 'lucide-react';

interface S1202Data { perApur: string; cpfTrab: string; nmTrab: string; dtNascto: string; vrSalFx: number; }

export const S1202RemuneracaoRPPS: React.FC = () => {
  const [data, setData] = useState<S1202Data>({ perApur: '', cpfTrab: '', nmTrab: '', dtNascto: '', vrSalFx: 0 });
  const [status, setStatus] = useState<'rascunho' | 'validado' | 'enviado'>('rascunho');

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" />S-1202 - Remuneração de Servidor Vinculado a RPPS<Badge variant="outline">{status}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Período Apuração</Label><Input type="month" value={data.perApur} onChange={(e) => setData({...data, perApur: e.target.value})} /></div>
          <div><Label>CPF Trabalhador</Label><Input value={data.cpfTrab} onChange={(e) => setData({...data, cpfTrab: e.target.value})} /></div>
          <div><Label>Nome</Label><Input value={data.nmTrab} onChange={(e) => setData({...data, nmTrab: e.target.value})} /></div>
          <div><Label>Salário Fixo</Label><Input type="number" value={data.vrSalFx} onChange={(e) => setData({...data, vrSalFx: Number(e.target.value)})} /></div>
        </div>
        <div className="flex gap-2"><Button onClick={() => setStatus('validado')}><Save className="h-4 w-4 mr-2" />Validar</Button><Button disabled={status !== 'validado'}><Send className="h-4 w-4 mr-2" />Enviar</Button></div>
      </CardContent>
    </Card>
  );
};
export default S1202RemuneracaoRPPS;
