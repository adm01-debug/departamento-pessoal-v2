// V15-401
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Calculator } from 'lucide-react';
const rescisoes = [{ id: '1', colaborador: 'Carlos Pereira', tipo: 'Sem Justa Causa', data: '15/01/2025', status: 'em_calculo' }, { id: '2', colaborador: 'Ana Lima', tipo: 'Pedido Demissão', data: '10/01/2025', status: 'pago' }];
const statusVariant: Record<string, 'warning' | 'success' | 'info'> = { em_calculo: 'warning', calculado: 'info', pago: 'success' };
export default function RescisaoPage() {
  return (
    <PageLayout title="Rescisões" actions={<Button><Plus className="h-4 w-4 mr-2" />Nova Rescisão</Button>}>
      <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{rescisoes.map(r => (<TableRow key={r.id}><TableCell className="font-medium">{r.colaborador}</TableCell><TableCell>{r.tipo}</TableCell><TableCell>{r.data}</TableCell><TableCell><StatusBadge status={r.status.replace('_', ' ')} variant={statusVariant[r.status]} /></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Calculator className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
