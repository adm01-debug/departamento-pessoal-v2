// V15-322
import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
const dependentes = [{ id: '1', nome: 'Ana Silva', parentesco: 'Filha', nascimento: '15/03/2015', idade: 9, irDeducao: true, salarioFamilia: true }, { id: '2', nome: 'Pedro Silva', parentesco: 'Filho', nascimento: '22/07/2018', idade: 6, irDeducao: true, salarioFamilia: true }];
export default function DependentesPage() {
  const { colaboradorId } = useParams();
  return (
    <PageLayout title="Dependentes" description="Gestão de dependentes do colaborador" actions={<Button><Plus className="h-4 w-4 mr-2" />Adicionar</Button>}>
      <Table>
        <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Parentesco</TableHead><TableHead>Nascimento</TableHead><TableHead>Idade</TableHead><TableHead>IR</TableHead><TableHead>Sal. Família</TableHead><TableHead className="w-[100px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{dependentes.map(d => (<TableRow key={d.id}><TableCell className="font-medium">{d.nome}</TableCell><TableCell>{d.parentesco}</TableCell><TableCell>{d.nascimento}</TableCell><TableCell>{d.idade} anos</TableCell><TableCell>{d.irDeducao ? <Badge>Sim</Badge> : <Badge variant="secondary">Não</Badge>}</TableCell><TableCell>{d.salarioFamilia ? <Badge>Sim</Badge> : <Badge variant="secondary">Não</Badge>}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
