import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Save, Send, Plus } from 'lucide-react';

interface Estabelecimento {
  tpInsc: string; nrInsc: string; iniValid: string; cnaePrep: string; nmCtt: string; cpfCtt: string;
  endereco: { tpLograd: string; dscLograd: string; nrLograd: string; bairro: string; cep: string; codMunic: string; uf: string; };
}

export const S1005Estabelecimentos: React.FC = () => {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [status, setStatus] = useState<'rascunho' | 'validado' | 'enviado'>('rascunho');

  const addEstabelecimento = () => {
    setEstabelecimentos([...estabelecimentos, {
      tpInsc: '1', nrInsc: '', iniValid: '', cnaePrep: '', nmCtt: '', cpfCtt: '',
      endereco: { tpLograd: '', dscLograd: '', nrLograd: '', bairro: '', cep: '', codMunic: '', uf: '' }
    }]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />S-1005 - Tabela de Estabelecimentos
          <Badge variant={status === 'enviado' ? 'default' : 'outline'}>{status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {estabelecimentos.map((est, idx) => (
          <div key={idx} className="border p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div><Label>CNPJ</Label><Input value={est.nrInsc} onChange={(e) => { const n = [...estabelecimentos]; n[idx].nrInsc = e.target.value; setEstabelecimentos(n); }} /></div>
              <div><Label>CNAE</Label><Input value={est.cnaePrep} onChange={(e) => { const n = [...estabelecimentos]; n[idx].cnaePrep = e.target.value; setEstabelecimentos(n); }} /></div>
              <div><Label>Início Validade</Label><Input type="month" value={est.iniValid} onChange={(e) => { const n = [...estabelecimentos]; n[idx].iniValid = e.target.value; setEstabelecimentos(n); }} /></div>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addEstabelecimento}><Plus className="h-4 w-4 mr-2" />Adicionar</Button>
        <div className="flex gap-2"><Button onClick={() => setStatus('validado')}><Save className="h-4 w-4 mr-2" />Validar</Button><Button disabled={status !== 'validado'} onClick={() => setStatus('enviado')}><Send className="h-4 w-4 mr-2" />Enviar</Button></div>
      </CardContent>
    </Card>
  );
};

export default S1005Estabelecimentos;
