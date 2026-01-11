// V15-321
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
const afastamentos = [{ id: '1', colaborador: 'João Silva', tipo: 'Doença', inicio: '01/01/2025', fim: '15/01/2025', dias: 15, status: 'ativo' }, { id: '2', colaborador: 'Maria Santos', tipo: 'Licença Maternidade', inicio: '10/12/2024', fim: '10/04/2025', dias: 120, status: 'ativo' }];
export default function AfastamentosPage() {
  return (
    <PageLayout title="Afastamentos" actions={<Button><Plus className="h-4 w-4 mr-2" />Novo</Button>}>
      <Table>
        <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Início</TableHead><TableHead>Fim</TableHead><TableHead>Dias</TableHead><TableHead>Status</TableHead><TableHead className="w-[80px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{afastamentos.map(a => (<TableRow key={a.id}><TableCell className="font-medium">{a.colaborador}</TableCell><TableCell>{a.tipo}</TableCell><TableCell>{a.inicio}</TableCell><TableCell>{a.fim}</TableCell><TableCell>{a.dias}</TableCell><TableCell><StatusBadge status={a.status} variant="info" /></TableCell><TableCell><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
