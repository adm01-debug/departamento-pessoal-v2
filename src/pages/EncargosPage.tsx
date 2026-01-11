// V15-406
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart } from '@/components/charts';
const encargos = [{ competencia: '01/2025', inss: 45000, fgts: 32000, irrf: 28000, total: 105000 }, { competencia: '12/2024', inss: 44000, fgts: 31500, irrf: 27500, total: 103000 }];
const chartData = [{ mes: 'Set', inss: 42000, fgts: 30000, irrf: 26000 }, { mes: 'Out', inss: 43000, fgts: 31000, irrf: 27000 }, { mes: 'Nov', inss: 44000, fgts: 31500, irrf: 27500 }, { mes: 'Dez', inss: 44000, fgts: 31500, irrf: 27500 }, { mes: 'Jan', inss: 45000, fgts: 32000, irrf: 28000 }];
export default function EncargosPage() {
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <PageLayout title="Encargos Sociais">
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">INSS</p><p className="text-2xl font-bold">{fmt(45000)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">FGTS</p><p className="text-2xl font-bold">{fmt(32000)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">IRRF</p><p className="text-2xl font-bold">{fmt(28000)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold text-primary">{fmt(105000)}</p></CardContent></Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <BarChart title="Evolução de Encargos" data={chartData} xKey="mes" bars={[{ dataKey: 'inss', color: '#3b82f6', name: 'INSS' }, { dataKey: 'fgts', color: '#22c55e', name: 'FGTS' }, { dataKey: 'irrf', color: '#f59e0b', name: 'IRRF' }]} />
        <Card><CardHeader><CardTitle>Histórico</CardTitle></CardHeader><CardContent>
          <Table><TableHeader><TableRow><TableHead>Competência</TableHead><TableHead>INSS</TableHead><TableHead>FGTS</TableHead><TableHead>IRRF</TableHead><TableHead>Total</TableHead></TableRow></TableHeader>
            <TableBody>{encargos.map((e, i) => (<TableRow key={i}><TableCell>{e.competencia}</TableCell><TableCell>{fmt(e.inss)}</TableCell><TableCell>{fmt(e.fgts)}</TableCell><TableCell>{fmt(e.irrf)}</TableCell><TableCell className="font-bold">{fmt(e.total)}</TableCell></TableRow>))}</TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </PageLayout>
  );
}
