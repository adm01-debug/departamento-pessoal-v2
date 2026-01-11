// V15-324
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
const registros = [{ id: '1', data: '10/01/2025', tipo: 'credito', horas: '+02:30', motivo: 'Hora extra' }, { id: '2', data: '08/01/2025', tipo: 'debito', horas: '-01:00', motivo: 'Compensação' }];
export default function BancoHorasPage() {
  return (
    <PageLayout title="Banco de Horas">
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card><CardContent className="pt-6 flex items-center gap-4"><div className="p-3 bg-green-100 rounded-full"><TrendingUp className="h-6 w-6 text-green-600" /></div><div><p className="text-2xl font-bold">+45:30</p><p className="text-sm text-muted-foreground">Créditos</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><div className="p-3 bg-red-100 rounded-full"><TrendingDown className="h-6 w-6 text-red-600" /></div><div><p className="text-2xl font-bold">-12:00</p><p className="text-sm text-muted-foreground">Débitos</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><div className="p-3 bg-blue-100 rounded-full"><Clock className="h-6 w-6 text-blue-600" /></div><div><p className="text-2xl font-bold">+33:30</p><p className="text-sm text-muted-foreground">Saldo</p></div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Movimentações</CardTitle></CardHeader><CardContent>
        <Table><TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Tipo</TableHead><TableHead>Horas</TableHead><TableHead>Motivo</TableHead></TableRow></TableHeader>
          <TableBody>{registros.map(r => (<TableRow key={r.id}><TableCell>{r.data}</TableCell><TableCell><Badge variant={r.tipo === 'credito' ? 'default' : 'destructive'}>{r.tipo === 'credito' ? 'Crédito' : 'Débito'}</Badge></TableCell><TableCell className={r.tipo === 'credito' ? 'text-green-600' : 'text-red-600'}>{r.horas}</TableCell><TableCell>{r.motivo}</TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </PageLayout>
  );
}
