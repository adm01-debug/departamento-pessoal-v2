// V15-320
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
const cargos = [{ id: '1', nome: 'Desenvolvedor', cbo: '2124-05', nivel: 'Pleno', salarioMin: 5000, salarioMax: 8000 }, { id: '2', nome: 'Analista RH', cbo: '2524-05', nivel: 'Senior', salarioMin: 6000, salarioMax: 10000 }];
export default function CargosPage() {
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <PageLayout title="Cargos" actions={<Button><Plus className="h-4 w-4 mr-2" />Novo</Button>}>
      <Table>
        <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>CBO</TableHead><TableHead>Nível</TableHead><TableHead>Faixa Salarial</TableHead><TableHead className="w-[100px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{cargos.map(c => (<TableRow key={c.id}><TableCell className="font-medium">{c.nome}</TableCell><TableCell>{c.cbo}</TableCell><TableCell><Badge variant="outline">{c.nivel}</Badge></TableCell><TableCell>{fmt(c.salarioMin)} - {fmt(c.salarioMax)}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
