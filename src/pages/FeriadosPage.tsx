// V15-328
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
const feriados = [{ id: '1', data: '01/01/2025', nome: 'Confraternização Universal', tipo: 'nacional' }, { id: '2', data: '25/01/2025', nome: 'Aniversário de São Paulo', tipo: 'municipal' }, { id: '3', data: '03/03/2025', nome: 'Carnaval', tipo: 'nacional' }, { id: '4', data: '18/04/2025', nome: 'Sexta-Feira Santa', tipo: 'nacional' }];
export default function FeriadosPage() {
  return (
    <PageLayout title="Feriados" actions={<Button><Plus className="h-4 w-4 mr-2" />Novo</Button>}>
      <Table><TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead className="w-[100px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{feriados.map(f => (<TableRow key={f.id}><TableCell>{f.data}</TableCell><TableCell className="font-medium">{f.nome}</TableCell><TableCell><Badge variant={f.tipo === 'nacional' ? 'default' : 'secondary'}>{f.tipo}</Badge></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
