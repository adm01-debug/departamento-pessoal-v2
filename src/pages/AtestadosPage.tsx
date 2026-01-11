// V15-410
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Check, X } from 'lucide-react';
const atestados = [{ id: '1', colaborador: 'João Silva', tipo: 'Médico', inicio: '10/01/2025', dias: 3, cid: 'J11', status: 'aprovado' }, { id: '2', colaborador: 'Maria Santos', tipo: 'Médico', inicio: '08/01/2025', dias: 1, cid: 'R51', status: 'pendente' }];
export default function AtestadosPage() {
  const statusVariant = (s: string) => s === 'aprovado' ? 'default' : s === 'pendente' ? 'secondary' : 'destructive';
  return (
    <PageLayout title="Atestados" actions={<Button><Plus className="h-4 w-4 mr-2" />Lançar Atestado</Button>}>
      <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Data Início</TableHead><TableHead>Dias</TableHead><TableHead>CID</TableHead><TableHead>Status</TableHead><TableHead className="w-[120px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{atestados.map(a => (<TableRow key={a.id}><TableCell className="font-medium">{a.colaborador}</TableCell><TableCell>{a.tipo}</TableCell><TableCell>{a.inicio}</TableCell><TableCell>{a.dias}</TableCell><TableCell>{a.cid}</TableCell><TableCell><Badge variant={statusVariant(a.status)}>{a.status}</Badge></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>{a.status === 'pendente' && <><Button variant="ghost" size="icon" className="text-green-600"><Check className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-red-600"><X className="h-4 w-4" /></Button></>}</div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
