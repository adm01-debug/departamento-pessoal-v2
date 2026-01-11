// V15-475
import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/formatters/currency';
import { Download, Printer, Lock, CheckCircle } from 'lucide-react';
const itens = [{ colaborador: 'João Silva', salarioBase: 5000, proventos: 5350, descontos: 730, liquido: 4620 }, { colaborador: 'Maria Santos', salarioBase: 6000, proventos: 6200, descontos: 920, liquido: 5280 }];
export default function FolhaDetalhe() {
  const { id } = useParams();
  const fmt = formatCurrency;
  return (
    <PageLayout title="Folha de Pagamento" description="Janeiro/2025" actions={<><Button variant="outline"><Printer className="h-4 w-4 mr-2" />Imprimir</Button><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button><Button><Lock className="h-4 w-4 mr-2" />Fechar Folha</Button></>}>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Proventos</p><p className="text-2xl font-bold text-green-600">{fmt(11550)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Descontos</p><p className="text-2xl font-bold text-red-600">{fmt(1650)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Líquido</p><p className="text-2xl font-bold text-primary">{fmt(9900)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Status</p><StatusBadge status="calculada" variant="warning" /></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Colaboradores</CardTitle></CardHeader><CardContent>
        <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Salário Base</TableHead><TableHead>Proventos</TableHead><TableHead>Descontos</TableHead><TableHead>Líquido</TableHead><TableHead className="w-[80px]">Ações</TableHead></TableRow></TableHeader>
          <TableBody>{itens.map((i, idx) => (<TableRow key={idx}><TableCell className="font-medium">{i.colaborador}</TableCell><TableCell>{fmt(i.salarioBase)}</TableCell><TableCell className="text-green-600">{fmt(i.proventos)}</TableCell><TableCell className="text-red-600">{fmt(i.descontos)}</TableCell><TableCell className="font-bold">{fmt(i.liquido)}</TableCell><TableCell><Button variant="ghost" size="sm">Ver</Button></TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </PageLayout>
  );
}
