import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Gift, Plus, Users, Settings } from 'lucide-react';

interface Beneficiario { id: string; nome: string; cpf: string; valor: number; status: string; }

export const GestaoAuxilioCreche: React.FC = () => {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [valorPadrao, setValorPadrao] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5" />Auxílio Creche</CardTitle>
        <CardDescription>Reembolso de despesas com creche</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div><Label>Valor Padrão (R$)</Label><Input type="number" value={valorPadrao} onChange={(e) => setValorPadrao(Number(e.target.value))} /></div>
          <div className="flex items-end"><Button><Plus className="h-4 w-4 mr-2" />Adicionar Beneficiário</Button></div>
          <div className="flex items-end"><Button variant="outline"><Settings className="h-4 w-4 mr-2" />Configurações</Button></div>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>CPF</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {beneficiarios.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum beneficiário cadastrado</TableCell></TableRow>}
            {beneficiarios.map(b => (
              <TableRow key={b.id}><TableCell>{b.nome}</TableCell><TableCell>{b.cpf}</TableCell><TableCell>R$ {b.valor.toFixed(2)}</TableCell><TableCell><Badge>{b.status}</Badge></TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
export default GestaoAuxilioCreche;
