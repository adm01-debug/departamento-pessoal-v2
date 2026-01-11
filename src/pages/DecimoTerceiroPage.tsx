// V15-405
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Calculator, Calendar } from 'lucide-react';
const parcelas = [{ id: '1', colaborador: 'João Silva', salarioBase: 5000, primeira: 2500, segunda: 2300, status: 'pago' }, { id: '2', colaborador: 'Maria Santos', salarioBase: 6000, primeira: 3000, segunda: 2760, status: 'pendente' }];
export default function DecimoTerceiroPage() {
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <PageLayout title="13º Salário" actions={<Button><Calculator className="h-4 w-4 mr-2" />Calcular 13º</Button>}>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">1ª Parcela</p><p className="text-lg font-bold">Até 30/11</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">2ª Parcela</p><p className="text-lg font-bold">Até 20/12</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Previsto</p><p className="text-lg font-bold text-green-600">{fmt(11000)}</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Colaboradores</CardTitle></CardHeader><CardContent>
        <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Salário Base</TableHead><TableHead>1ª Parcela</TableHead><TableHead>2ª Parcela</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>{parcelas.map(p => (<TableRow key={p.id}><TableCell className="font-medium">{p.colaborador}</TableCell><TableCell>{fmt(p.salarioBase)}</TableCell><TableCell>{fmt(p.primeira)}</TableCell><TableCell>{fmt(p.segunda)}</TableCell><TableCell><StatusBadge status={p.status} variant={p.status === 'pago' ? 'success' : 'warning'} /></TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </PageLayout>
  );
}
