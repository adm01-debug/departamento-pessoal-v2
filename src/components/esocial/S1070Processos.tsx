import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Scale, Plus, Save, Send } from 'lucide-react';

interface Processo { tpProc: string; nrProc: string; iniValid: string; indSusp: string; codSusp: string; indDeposito: string; }

export const S1070Processos: React.FC = () => {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [status, setStatus] = useState<'rascunho' | 'validado' | 'enviado'>('rascunho');
  const addProcesso = () => setProcessos([...processos, { tpProc: '1', nrProc: '', iniValid: '', indSusp: '01', codSusp: '', indDeposito: 'N' }]);

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5" />S-1070 - Tabela de Processos Administrativos/Judiciais<Badge variant="outline">{status}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {processos.map((proc, idx) => (
          <div key={idx} className="border p-4 rounded-lg grid grid-cols-3 gap-4">
            <div><Label>Tipo Processo</Label><Select value={proc.tpProc} onValueChange={(v) => { const n = [...processos]; n[idx].tpProc = v; setProcessos(n); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">Administrativo</SelectItem><SelectItem value="2">Judicial</SelectItem></SelectContent></Select></div>
            <div><Label>Nº Processo</Label><Input value={proc.nrProc} onChange={(e) => { const n = [...processos]; n[idx].nrProc = e.target.value; setProcessos(n); }} /></div>
            <div><Label>Início Validade</Label><Input type="month" value={proc.iniValid} onChange={(e) => { const n = [...processos]; n[idx].iniValid = e.target.value; setProcessos(n); }} /></div>
          </div>
        ))}
        <Button variant="outline" onClick={addProcesso}><Plus className="h-4 w-4 mr-2" />Novo Processo</Button>
        <div className="flex gap-2"><Button onClick={() => setStatus('validado')}><Save className="h-4 w-4 mr-2" />Validar</Button><Button disabled={status !== 'validado'}><Send className="h-4 w-4 mr-2" />Enviar</Button></div>
      </CardContent>
    </Card>
  );
};
export default S1070Processos;
