import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Save, Send } from 'lucide-react';

interface Lotacao { codLotacao: string; iniValid: string; tpLotacao: string; tpInsc: string; nrInsc: string; fpasLotacao: string; }

export const S1020Lotacoes: React.FC = () => {
  const [lotacoes, setLotacoes] = useState<Lotacao[]>([]);
  const [status, setStatus] = useState<'rascunho' | 'validado' | 'enviado'>('rascunho');
  const addLotacao = () => setLotacoes([...lotacoes, { codLotacao: '', iniValid: '', tpLotacao: '01', tpInsc: '1', nrInsc: '', fpasLotacao: '515' }]);

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />S-1020 - Tabela de Lotações Tributárias<Badge variant="outline">{status}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {lotacoes.map((lot, idx) => (
          <div key={idx} className="border p-4 rounded-lg grid grid-cols-3 gap-4">
            <div><Label>Código Lotação</Label><Input value={lot.codLotacao} onChange={(e) => { const n = [...lotacoes]; n[idx].codLotacao = e.target.value; setLotacoes(n); }} /></div>
            <div><Label>Início Validade</Label><Input type="month" value={lot.iniValid} onChange={(e) => { const n = [...lotacoes]; n[idx].iniValid = e.target.value; setLotacoes(n); }} /></div>
            <div><Label>FPAS</Label><Input value={lot.fpasLotacao} onChange={(e) => { const n = [...lotacoes]; n[idx].fpasLotacao = e.target.value; setLotacoes(n); }} /></div>
          </div>
        ))}
        <Button variant="outline" onClick={addLotacao}><Plus className="h-4 w-4 mr-2" />Nova Lotação</Button>
        <div className="flex gap-2"><Button onClick={() => setStatus('validado')}><Save className="h-4 w-4 mr-2" />Validar</Button><Button disabled={status !== 'validado'}><Send className="h-4 w-4 mr-2" />Enviar</Button></div>
      </CardContent>
    </Card>
  );
};
export default S1020Lotacoes;
