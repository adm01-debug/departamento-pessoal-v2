// V15-330
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
const sindicatos = [{ id: '1', nome: 'Sindicato dos Metalúrgicos', cnpj: '12.345.678/0001-90', contribuicao: 'R$ 50,00', dataBase: 'Janeiro' }, { id: '2', nome: 'Sindicato do Comércio', cnpj: '98.765.432/0001-10', contribuicao: 'R$ 35,00', dataBase: 'Março' }];
export default function SindicatosPage() {
  return (
    <PageLayout title="Sindicatos" actions={<Button><Plus className="h-4 w-4 mr-2" />Novo</Button>}>
      <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>CNPJ</TableHead><TableHead>Contribuição</TableHead><TableHead>Data Base</TableHead><TableHead className="w-[100px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{sindicatos.map(s => (<TableRow key={s.id}><TableCell className="font-medium">{s.nome}</TableCell><TableCell>{s.cnpj}</TableCell><TableCell>{s.contribuicao}</TableCell><TableCell>{s.dataBase}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
