import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Save, Send } from 'lucide-react';

interface S1000Data {
  ideEmpregador: { tpInsc: string; nrInsc: string; };
  infoCadastro: { nmRazao: string; classTrib: string; natJurid: string; indCoop: string; indConstr: string; indDesFolha: string; indOpcCP: string; indOptRegEletron: string; };
  contato: { nmCtt: string; cpfCtt: string; foneFixo: string; foneCel: string; email: string; };
}

export const S1000Empregador: React.FC = () => {
  const [data, setData] = useState<S1000Data>({
    ideEmpregador: { tpInsc: '1', nrInsc: '' },
    infoCadastro: { nmRazao: '', classTrib: '', natJurid: '', indCoop: '0', indConstr: '0', indDesFolha: '0', indOpcCP: '0', indOptRegEletron: '1' },
    contato: { nmCtt: '', cpfCtt: '', foneFixo: '', foneCel: '', email: '' },
  });
  const [status, setStatus] = useState<'rascunho' | 'validado' | 'enviado'>('rascunho');

  const handleSubmit = () => { setStatus('validado'); };
  const handleEnviar = () => { setStatus('enviado'); };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          S-1000 - Informações do Empregador/Contribuinte
          <Badge variant={status === 'enviado' ? 'default' : status === 'validado' ? 'secondary' : 'outline'}>{status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Tipo Inscrição</Label><Select value={data.ideEmpregador.tpInsc} onValueChange={(v) => setData({...data, ideEmpregador: {...data.ideEmpregador, tpInsc: v}})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">CNPJ</SelectItem><SelectItem value="2">CPF</SelectItem></SelectContent></Select></div>
          <div><Label>Nº Inscrição</Label><Input value={data.ideEmpregador.nrInsc} onChange={(e) => setData({...data, ideEmpregador: {...data.ideEmpregador, nrInsc: e.target.value}})} /></div>
          <div className="col-span-2"><Label>Razão Social</Label><Input value={data.infoCadastro.nmRazao} onChange={(e) => setData({...data, infoCadastro: {...data.infoCadastro, nmRazao: e.target.value}})} /></div>
          <div><Label>Classificação Tributária</Label><Input value={data.infoCadastro.classTrib} onChange={(e) => setData({...data, infoCadastro: {...data.infoCadastro, classTrib: e.target.value}})} /></div>
          <div><Label>Natureza Jurídica</Label><Input value={data.infoCadastro.natJurid} onChange={(e) => setData({...data, infoCadastro: {...data.infoCadastro, natJurid: e.target.value}})} /></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit}><Save className="h-4 w-4 mr-2" />Validar</Button>
          <Button onClick={handleEnviar} disabled={status !== 'validado'}><Send className="h-4 w-4 mr-2" />Enviar eSocial</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default S1000Empregador;
