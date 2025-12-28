import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Save, FileText, AlertTriangle } from 'lucide-react';

export const InvestigacaoAcidente: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [status, setStatus] = useState<'rascunho' | 'vigente' | 'vencido'>('rascunho');

  const salvar = () => { setStatus('vigente'); };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Investigação de Acidente<Badge variant={status === 'vigente' ? 'default' : status === 'vencido' ? 'destructive' : 'outline'}>{status}</Badge></CardTitle>
        <CardDescription>Análise de acidentes e quase-acidentes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Título do Documento</Label><Input value={titulo} onChange={(e) => setTitulo(e.target.value)} /></div>
          <div><Label>Responsável Técnico</Label><Input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} /></div>
          <div><Label>Data de Validade</Label><Input type="date" value={dataValidade} onChange={(e) => setDataValidade(e.target.value)} /></div>
          <div><Label>Setor/Área</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="producao">Produção</SelectItem><SelectItem value="administrativo">Administrativo</SelectItem><SelectItem value="logistica">Logística</SelectItem></SelectContent></Select></div>
        </div>
        <div><Label>Descrição / Conteúdo</Label><Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={6} placeholder="Descreva os riscos identificados, medidas de controle, etc..." /></div>
        <div className="flex gap-2">
          <Button onClick={salvar}><Save className="h-4 w-4 mr-2" />Salvar</Button>
          <Button variant="outline"><FileText className="h-4 w-4 mr-2" />Gerar PDF</Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default InvestigacaoAcidente;
