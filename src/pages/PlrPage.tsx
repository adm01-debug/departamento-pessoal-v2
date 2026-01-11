// V15-404
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign } from 'lucide-react';
const plr = [{ id: '1', ano: '2024', valor: 5000, status: 'pago', dataPagamento: '15/02/2025' }, { id: '2', ano: '2023', valor: 4500, status: 'pago', dataPagamento: '15/02/2024' }];
export default function PlrPage() {
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <PageLayout title="PLR - Participação nos Lucros" actions={<Button><Calculator className="h-4 w-4 mr-2" />Calcular PLR</Button>}>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card><CardContent className="pt-6 flex items-center gap-4"><DollarSign className="h-8 w-8 text-green-600" /><div><p className="text-2xl font-bold">{fmt(5000)}</p><p className="text-sm text-muted-foreground">PLR 2024</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Próximo pagamento</p><p className="text-lg font-bold">15/02/2025</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Histórico</CardTitle></CardHeader><CardContent>
        <Table><TableHeader><TableRow><TableHead>Ano</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead><TableHead>Data Pagamento</TableHead></TableRow></TableHeader>
          <TableBody>{plr.map(p => (<TableRow key={p.id}><TableCell>{p.ano}</TableCell><TableCell className="font-bold">{fmt(p.valor)}</TableCell><TableCell className="text-green-600 capitalize">{p.status}</TableCell><TableCell>{p.dataPagamento}</TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </PageLayout>
  );
}
