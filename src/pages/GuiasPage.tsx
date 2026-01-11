// V15-407
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Download, Printer, FileText } from 'lucide-react';
const guias = [{ id: '1', tipo: 'DARF', competencia: '01/2025', vencimento: '20/02/2025', valor: 28000, status: 'aberta' }, { id: '2', tipo: 'GPS', competencia: '01/2025', vencimento: '20/02/2025', valor: 45000, status: 'aberta' }, { id: '3', tipo: 'GFIP', competencia: '01/2025', vencimento: '07/02/2025', valor: 32000, status: 'paga' }];
export default function GuiasPage() {
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const statusVariant = (s: string) => s === 'paga' ? 'success' : s === 'aberta' ? 'warning' : 'error';
  return (
    <PageLayout title="Guias de Recolhimento" actions={<Button><FileText className="h-4 w-4 mr-2" />Gerar Guias</Button>}>
      <Card><CardContent className="pt-6">
        <Table><TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Competência</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]">Ações</TableHead></TableRow></TableHeader>
          <TableBody>{guias.map(g => (<TableRow key={g.id}><TableCell className="font-medium">{g.tipo}</TableCell><TableCell>{g.competencia}</TableCell><TableCell>{g.vencimento}</TableCell><TableCell className="font-bold">{fmt(g.valor)}</TableCell><TableCell><StatusBadge status={g.status} variant={statusVariant(g.status) as any} /></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Printer className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </PageLayout>
  );
}
