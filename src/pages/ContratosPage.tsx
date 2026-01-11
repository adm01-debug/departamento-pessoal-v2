// V15-408
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, FileText } from 'lucide-react';
const contratos = [{ id: '1', colaborador: 'João Silva', tipo: 'CLT', inicio: '01/03/2020', termino: 'Indeterminado', status: 'ativo' }, { id: '2', colaborador: 'Maria Santos', tipo: 'Temporário', inicio: '01/01/2025', termino: '30/06/2025', status: 'ativo' }, { id: '3', colaborador: 'Pedro Lima', tipo: 'Estágio', inicio: '01/07/2024', termino: '30/06/2025', status: 'ativo' }];
export default function ContratosPage() {
  return (
    <PageLayout title="Contratos de Trabalho">
      <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Início</TableHead><TableHead>Término</TableHead><TableHead>Status</TableHead><TableHead className="w-[120px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{contratos.map(c => (<TableRow key={c.id}><TableCell className="font-medium">{c.colaborador}</TableCell><TableCell><Badge variant="outline">{c.tipo}</Badge></TableCell><TableCell>{c.inicio}</TableCell><TableCell>{c.termino}</TableCell><TableCell><Badge variant={c.status === 'ativo' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
