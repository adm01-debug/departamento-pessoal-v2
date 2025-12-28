import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt, Plus, Trash2, Save, Send } from 'lucide-react';

interface Rubrica { codRubr: string; dscRubr: string; natRubr: string; tpRubr: string; codIncCP: string; codIncIRRF: string; codIncFGTS: string; }

export const S1010Rubricas: React.FC = () => {
  const [rubricas, setRubricas] = useState<Rubrica[]>([]);
  const [status, setStatus] = useState<'rascunho' | 'validado' | 'enviado'>('rascunho');

  const addRubrica = () => setRubricas([...rubricas, { codRubr: '', dscRubr: '', natRubr: '', tpRubr: '1', codIncCP: '00', codIncIRRF: '00', codIncFGTS: '00' }]);
  const removeRubrica = (idx: number) => setRubricas(rubricas.filter((_, i) => i !== idx));

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />S-1010 - Tabela de Rubricas<Badge variant="outline">{status}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Descrição</TableHead><TableHead>Natureza</TableHead><TableHead>Tipo</TableHead><TableHead>INSS</TableHead><TableHead>IRRF</TableHead><TableHead>FGTS</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {rubricas.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell><Input value={r.codRubr} onChange={(e) => { const n = [...rubricas]; n[idx].codRubr = e.target.value; setRubricas(n); }} className="w-20" /></TableCell>
                <TableCell><Input value={r.dscRubr} onChange={(e) => { const n = [...rubricas]; n[idx].dscRubr = e.target.value; setRubricas(n); }} /></TableCell>
                <TableCell><Input value={r.natRubr} onChange={(e) => { const n = [...rubricas]; n[idx].natRubr = e.target.value; setRubricas(n); }} className="w-16" /></TableCell>
                <TableCell><Select value={r.tpRubr} onValueChange={(v) => { const n = [...rubricas]; n[idx].tpRubr = v; setRubricas(n); }}><SelectTrigger className="w-24"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">Vencimento</SelectItem><SelectItem value="2">Desconto</SelectItem><SelectItem value="3">Informativa</SelectItem></SelectContent></Select></TableCell>
                <TableCell><Input value={r.codIncCP} onChange={(e) => { const n = [...rubricas]; n[idx].codIncCP = e.target.value; setRubricas(n); }} className="w-12" /></TableCell>
                <TableCell><Input value={r.codIncIRRF} onChange={(e) => { const n = [...rubricas]; n[idx].codIncIRRF = e.target.value; setRubricas(n); }} className="w-12" /></TableCell>
                <TableCell><Input value={r.codIncFGTS} onChange={(e) => { const n = [...rubricas]; n[idx].codIncFGTS = e.target.value; setRubricas(n); }} className="w-12" /></TableCell>
                <TableCell><Button variant="ghost" size="sm" onClick={() => removeRubrica(idx)}><Trash2 className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="outline" onClick={addRubrica}><Plus className="h-4 w-4 mr-2" />Nova Rubrica</Button>
        <div className="flex gap-2"><Button onClick={() => setStatus('validado')}><Save className="h-4 w-4 mr-2" />Validar</Button><Button disabled={status !== 'validado'}><Send className="h-4 w-4 mr-2" />Enviar</Button></div>
      </CardContent>
    </Card>
  );
};

export default S1010Rubricas;
