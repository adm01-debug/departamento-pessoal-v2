// V15-411
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Plus, Eye, FileText } from 'lucide-react';
const avisos = [{ id: '1', colaborador: 'Carlos Pereira', tipo: 'Trabalhado', inicio: '01/01/2025', fim: '30/01/2025', diasProj: 3, status: 'em_andamento' }, { id: '2', colaborador: 'Ana Lima', tipo: 'Indenizado', inicio: '15/01/2025', fim: '-', diasProj: 0, status: 'concluido' }];
export default function AvisoPrevioPage() {
  const statusVariant = (s: string) => s === 'concluido' ? 'success' : s === 'em_andamento' ? 'warning' : 'info';
  return (
    <PageLayout title="Aviso Prévio" actions={<Button><Plus className="h-4 w-4 mr-2" />Novo Aviso</Button>}>
      <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Início</TableHead><TableHead>Fim</TableHead><TableHead>Dias Proj.</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{avisos.map(a => (<TableRow key={a.id}><TableCell className="font-medium">{a.colaborador}</TableCell><TableCell>{a.tipo}</TableCell><TableCell>{a.inicio}</TableCell><TableCell>{a.fim}</TableCell><TableCell>{a.diasProj > 0 ? `+${a.diasProj} dias` : '-'}</TableCell><TableCell><StatusBadge status={a.status.replace('_', ' ')} variant={statusVariant(a.status) as any} /></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
